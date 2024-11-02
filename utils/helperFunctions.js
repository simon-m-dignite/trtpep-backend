// Utility functions:
function convertDate(dateString) {
  const date = new Date(dateString);
  // Add 12 hours to the original date
  date.setHours(date.getHours() + 12);
  // Convert back to ISO string
  return date.toISOString();
}

function convertToDate(isoString) {
  const date = new Date(isoString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function convertToTime(isoString) {
  const date = new Date(isoString);
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function convertTimeToISO(dateString, timeString) {
  const date = new Date(dateString);
  const [hours, minutes] = timeString.split(":").map(Number);

  date.setUTCHours(hours);
  date.setUTCMinutes(minutes);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);

  return date.toISOString();
}

function isWithinShiftAndNotBreak(doctorTiming, timeToCheck) {
  const time = convertToTime(timeToCheck);
  const shiftStart = convertToTime(doctorTiming.shiftStartTime);
  const shiftEnd = convertToTime(doctorTiming.shiftEndTime);
  const breakStart = convertToTime(doctorTiming.breakStartTime);
  const breakEnd = convertToTime(
    new Date(doctorTiming.breakStartTime).getTime() +
      doctorTiming.breakDuration * 60000
  );

  console.log(
    "shiftStart:",
    shiftStart,
    "shiftEnd:",
    shiftEnd,
    "breakStart:",
    breakStart,
    "breakEnd:",
    breakEnd,
    "time:",
    time
  );

  if (time >= shiftStart && time < shiftEnd) {
    if (time >= breakStart && time < breakEnd) {
      return false; // Time is within break time
    }
    return true; // Time is within shift hours and not in break time
  }
  return false; // Time is outside shift hours
}

function getDayFromDate(dateString) {
  const date = new Date(dateString);
  // Convert to local time zone before getting day
  const localDay = date.toLocaleString("en-us", {
    weekday: "long",
    timeZone: "UTC",
  });
  return localDay;
}

module.exports = {
  convertDate,
  convertToDate,
  convertToTime,
  convertTimeToISO,
  isWithinShiftAndNotBreak,
  getDayFromDate,
};
