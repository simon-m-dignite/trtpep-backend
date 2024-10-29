const mongooose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const UserModel = mongooose.model("SuperAdmin");
const nodemailer = require("nodemailer");
const { default: mongoose } = require("mongoose");
const OTPModel = mongoose.model("SuperAdminOTP");

// register admin
module.exports.CreateUser = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  //   console.log("efefwef >> ", req.body);
  try {
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.status(200).send({ message: "Email already exists" });
    }
    await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(200).send({ message: "User created successfully" });
  } catch (error) {
    console.log("register server error >> ", error);
    res.status(500).send({ message: error });
  }
};

module.exports.LoginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const isUser = await UserModel.findOne({ email });

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
      profile: { name: isUser.name, email: isUser.email, id: isUser._id },
      accessToken,
    });
  } catch (error) {
    console.error("Login server error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// verify email
module.exports.ForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const userExist = await UserModel.findOne({ email });

    if (!userExist) {
      return res
        .status(404)
        .json({ status: 404, message: "Email does not exist." });
    }

    // Find existing OTP for the email
    const existingOtp = await OTPModel.findOne({ email });

    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "professorcoding123@gmail.com",
        pass: "bhmkhbxysiztceii",
      },
    });

    // Verify connection configuration
    transporter.verify((error, success) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          status: 500,
          message: "Failed to connect to the email server.",
        });
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    // Generate OTP
    const generateOtp = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const otp = generateOtp();

    // Define mail options
    const mailOptions = {
      from: "trtpep@mail.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}`,
    };

    // Handle OTP creation/update and sending email
    if (!existingOtp) {
      await OTPModel.create({ code: otp, email: email });
    } else {
      const filter = { email: email };
      const update = { code: otp };
      await OTPModel.findOneAndUpdate(filter, update);
    }

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ status: 200, message: "OTP sent to your email.", otp: otp });
  } catch (error) {
    console.log("Forgot password server error >> ", error);
    res.status(500).json({
      status: 500,
      message: "Something went wrong, please try again.",
    });
  }
};

// Request new OTP
module.exports.RequestOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Find existing OTP for the email
    const existingOtp = await OTPModel.findOne({ email });

    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "professorcoding123@gmail.com",
        pass: "bhmkhbxysiztceii",
      },
    });

    // Verify connection configuration
    transporter.verify((error, success) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          status: 500,
          message: "Failed to connect to the email server.",
        });
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    // Generate OTP
    const generateOtp = () => {
      return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const otp = generateOtp();

    // Define mail options
    const mailOptions = {
      from: "trtpep@mail.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}`,
    };

    // Handle OTP creation/update and sending email
    if (!existingOtp) {
      await OTPModel.create({ code: otp, email: email });
    } else {
      const filter = { email: email };
      const update = { code: otp };
      await OTPModel.findOneAndUpdate(filter, update);
    }

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ status: 200, message: "OTP resent to your email.", otp: otp });
  } catch (error) {
    console.error("Server error:", error); // Log the error for debugging
    return res.status(500).json({
      message: "Server error",
      error: error.message || "Unknown error",
    });
  }
};

// verify otp
module.exports.VerifyOtp = async (req, res) => {
  const { email, code } = req.body;
  // console.log(req.body);

  if (!email || !code) {
    return res.status(400).json({ message: "Email and OTP code are required" });
  }

  try {
    const otp = await OTPModel.findOne({ email });

    if (otp && otp.code === code) {
      // OTP is correct
      await OTPModel.findOneAndUpdate({ email: email }, { isVerified: true });
      return res
        .status(200)
        .json({ message: "OTP verified successfully", status: 200 });
    } else {
      // OTP is incorrect
      return res.status(400).json({ message: "Invalid OTP", status: 400 });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error, status: 500 });
  }
};

// reset password
module.exports.ResetPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const isUser = await UserModel.findOne({ email });
    if (isUser == null) {
      return res.status(404).send({ message: "Email does not exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.findOneAndUpdate(
      { email: email },
      { password: hashedPassword }
    );

    return res
      .status(200)
      .json({ message: "Password changed successfully", status: 200 });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error, status: 500 });
  }
};
