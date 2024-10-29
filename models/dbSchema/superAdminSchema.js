const mongooose = require("mongoose");

const UserSchema = new mongooose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    collection: "SuperAdmin",
  }
);

mongooose.model("SuperAdmin", UserSchema);
