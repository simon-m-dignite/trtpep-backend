const express = require("express");
const cors = require("cors");
require("dotenv").config();
var corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "ngrok-skip-browser-warning"],
  optionsSuccessStatus: 200,
};
const bodyParser = require("body-parser");

const { DBConnection } = require("./models/dbConnection");
const PORT = process.env.PORT;

const app = express();

// Middlewares here
app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

DBConnection();
// schemas
require("./models/dbSchema/userSchema");
require("./models/dbSchema/otpSchema");
require("./models/dbSchema/labOrders");
require("./models/dbSchema/NewPatientSchema");
require("./models/dbSchema/enrollSchema");
require("./models/dbSchema/doctorsSchema");
require("./models/dbSchema/serviceSchema");
require("./models/dbSchema/appointmentsSchema");
require("./models/dbSchema/productsSchema");
require("./models/dbSchema/pricesSchema");
require("./models/dbSchema/faqsSchema");
require("./models/dbSchema/policySchema");
require("./models/dbSchema/blogSchema");
require("./models/dbSchema/bookedAppointmentSchema");
require("./models/dbSchema/customers");

// routes
app.use("/api", require("./routes/userRoutes"));
app.use("/api", require("./routes/patientRoutes"));
app.use("/api", require("./routes/labOrderRoutes"));
app.use("/api", require("./routes/doctorRoutes"));
app.use("/api", require("./routes/serviceRoutes"));
app.use("/api", require("./routes/appointmentRoutes"));
app.use("/api", require("./routes/productsRoutes"));
app.use("/api", require("./routes/pricesRoutes"));
app.use("/api", require("./routes/faqsRoutes"));
app.use("/api", require("./routes/privacyPolicyRoutes"));
app.use("/api", require("./routes/blogRoutes"));
app.use("/api", require("./routes/customerRoutes"));

// Routes here
app.get("/hello", (req, res) => {
  res.send("Hello World");
});

// Listen
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
