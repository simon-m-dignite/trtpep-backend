const mongoose = require("mongoose");
const ServiceModal = mongoose.model("DoctorServices");
const DoctorsModal = mongoose.model("Doctors");

module.exports.CreateService = async (req, res) => {
  try {
    const {
      doctorId,
      serviceTitle,
      serviceSubtitle,
      price,
      duration,
      timeSlots,
    } = req.body;
    // console.log("service data >> ", req.body);

    const isOldService = await ServiceModal.findOne({ serviceSubtitle });

    if (isOldService) {
      return res
        .status(200)
        .send({ message: "This service is already added!" });
    }

    await ServiceModal.create({
      doctorId,
      serviceTitle,
      serviceSubtitle,
      price: price || 0,
      duration,
      timeSlots,
    });
    res.status(200).send({ message: "Service created successfully." });
  } catch (error) {
    console.log("register server error >> ", error);
    res.status(500).send({ message: error });
  }
};

module.exports.GetDoctorServices = async (req, res) => {
  try {
    const { doctorId } = req.params;
    // console.log("doctorId >> ", doctorId);
    const doctorServices = await ServiceModal.find({ doctorId });
    const doctorProfile = await DoctorsModal.findById(doctorId);
    if (doctorServices.length > 0) {
      return res.status(200).send({
        message: "Success",
        services: doctorServices,
        doctorEmail: doctorProfile.email,
      });
    }

    res
      .status(200)
      .send({ message: "You haven't created any service till now." });
  } catch (error) {
    console.log("getDoctorServices error >> ", error);
    res.status(500).send({ message: "Something went wrong.", error });
  }
};

module.exports.GetAllServices = async (req, res) => {
  try {
    const services = await ServiceModal.find({});
    if (services.length > 0) {
      return res.status(200).send({ message: "success", services });
    }
    res.status(200).send({ message: "No Services have been created yet." });
  } catch (error) {
    console.log("GetAllServices error >>", error);
    res.status(500).send({ message: "Something went wrong.", error });
  }
};

module.exports.DeleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await ServiceModal.findById({ _id: id });
    if (!service) {
      return res.status(404).send({ message: "Service not found." });
    }
    await ServiceModal.findByIdAndDelete({ _id: id });
    res.status(200).send({ message: "Service deleted successfully" });
  } catch (error) {
    console.log("DleeteSerive error >> ", error);
    res.status(500).send({ message: "Something went wrong." });
  }
};
