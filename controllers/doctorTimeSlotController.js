const mongoose = require("mongoose");
const TimeSlot = mongoose.model("DoctorTimeSlots");

// Controller to save time slots
module.exports.saveTimeSlots = async (req, res) => {
  const { doctorId, slots } = req.body;

  if (!doctorId || !slots || slots.length === 0) {
    return res.status(400).json({ message: "Invalid data provided" });
  }

  try {
    const newTimeSlot = new TimeSlot({
      doctorId,
      slots,
    });

    await newTimeSlot.save();

    return res.status(201).json({
      message: "Time slots saved successfully",
      timeSlot: newTimeSlot,
    });
  } catch (error) {
    console.error("Error saving time slots:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// Function to get day of the week from a date
const getDayFromDate = (date) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  console.log(days[new Date(date).getDay()]);
  return days[new Date(date).getDay()]; // Adjusting for your need (Monday to Friday)
};

module.exports.getTimeSlots = async (req, res) => {
  const { duration, date, doctorId } = req.body;

  // Validate input
  if (!duration) {
    return res
      .status(400)
      .json({ message: "You must provide duration of the service." });
  }
  if (!date) {
    return res.status(400).json({
      message: "Please select a date at which you want to book the slot.",
    });
  }
  if (!doctorId) {
    return res.status(400).json({ message: "You must provide the doctor id." });
  }

  // Get the day of the week from the provided date
  const dayOfWeek = getDayFromDate(date);
  if (
    !["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(
      dayOfWeek
    )
  ) {
    return res.status(400).json({
      message: "The selected date must be between Monday and Friday.",
    });
  }

  try {
    // Find the doctor's time slots for the specific day
    const timeSlots = await TimeSlot.findOne({
      doctorId,
      "slots.day": dayOfWeek,
    });

    console.log(timeSlots);

    if (!timeSlots) {
      return res
        .status(404)
        .json({ message: "No time slots found for the doctor on this day." });
    }

    // Extract the slots for the specified day
    const daySlots = timeSlots.slots.find((slot) => slot.day === dayOfWeek);

    console.log(daySlots);

    // Calculate available time slots based on the duration
    const availableSlots = [];
    const { startTime, endTime, breakStartTime, breakEndTime } = daySlots;

    console.log(startTime, endTime, breakStartTime, breakEndTime);

    // Convert times to Date objects for easier calculations
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const breakStart = new Date(`1970-01-01T${breakStartTime}:00`);
    const breakEnd = new Date(`1970-01-01T${breakEndTime}:00`);

    // Loop through the time slots and check for available time
    for (
      let time = start;
      time <= end;
      time.setMinutes(time.getMinutes() + 30)
    ) {
      // Adjust increment as needed
      const slotEndTime = new Date(time);
      slotEndTime.setMinutes(slotEndTime.getMinutes() + duration);

      // Check if slot is within working hours and not during break
      if (slotEndTime <= end && (time < breakStart || time >= breakEnd)) {
        availableSlots.push(time.toISOString().substring(11, 16)); // Format HH:mm
      }
    }

    return res.status(200).json({
      message: "Available time slots retrieved successfully",
      availableSlots,
    });
  } catch (error) {
    console.error("Error retrieving time slots:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
module.exports.FetchDoctorSlotsById = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const doctorSlot = await TimeSlot.find({ doctorId });
    res.status(200).json({ data: doctorSlot });
  } catch (error) {
    console.error("err >>", error);
    res.status(500).json({ message: "Server error", error });
  }
};
