const mongoose = require("mongoose");
const DoctorsModal = mongoose.model("Doctors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

module.exports.AddDoctor = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const userExist = await DoctorsModal.findOne({ email });
    if (userExist) {
      return res.status(200).send({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = await DoctorsModal.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    const doctorId = newDoctor._id;
    const schedulerUrl = `https://trtpep-schedular.vercel.app/${doctorId}`;

    const updatedDoctor = await DoctorsModal.findByIdAndUpdate(
      doctorId,
      { schedulerUrl },
      { new: true }
    );

    res
      .status(200)
      .send({ message: "User created successfully", updatedDoctor });
  } catch (error) {
    console.log("register server error >> ", error);
    res.status(500).send({ message: error });
  }
};

module.exports.LoginDoctor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const isUser = await DoctorsModal.findOne({ email });

    if (!isUser) {
      return res.status(404).json({ message: "Email does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, isUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = jwt.sign({ email: isUser.email }, SECRET_KEY, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      status: 200,
      message: "Login Successful",
      profile: {
        name: isUser.name,
        email: isUser.email,
        phone: isUser.phone,
        doctorId: isUser._id,
      },
      accessToken,
    });
  } catch (error) {
    console.error("Login server error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.fetchAllDoctors = async (req, res) => {
  try {
    const doctors = await DoctorsModal.find({});
    res.status(200).send({ message: "success", doctors });
  } catch (error) {
    console.log("fetchAllDoctors error >> ", error);
    res.status(500).send({ message: "Something went wrong." });
  }
};

module.exports.DeleteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await DoctorsModal.findById(doctorId);
    if (!doctor) {
      return res.status(404).send({ message: "No data found!" });
    }
    await DoctorsModal.findByIdAndDelete(doctorId);
    res.status(200).send({ message: "Deleted successfully!" });
  } catch (error) {
    console.log("delete doctor error >> ", error);
    res.status(500).send({ message: "Something went wrong!", error });
  }
};
