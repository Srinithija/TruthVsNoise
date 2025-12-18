const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await Admin.create({
    name: "Super Admin",
    email: "admin@truthvsnoise.com",
    password: hashedPassword
  });

  console.log("Admin created");
  process.exit();
};

createAdmin();
