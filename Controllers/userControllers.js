const userModel = require("../Models/userModels");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const resgisterUSer = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (user) {
      return res.status(400).json("This email is already in use");
    }

    if (!name || !email || !password) {
      return res.status(400).json("All fields are required..");
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json("Email must be a valid email");
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json(
        "Password must be a strong password"
      );
    }

    user = new userModel({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    console.error(error); // Use console.error for errors
    res.status(500).json(error); // Send 500 for server errors
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json("Invalid Email or Password"); // Use 401 for authentication failure
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json("Invalid Email or Password"); // Consistent error message
    }

    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, name: user.name, email, token });
  } catch (error) {
    console.error(error); // Use console.error for errors
    res.status(500).json(error); // Send 500 for server errors
  }
};

const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.error(error); // Use console.error for errors
    res.status(400).json(error); // Keep 400 for invalid user ID format etc.
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error); // Use console.error for errors
    res.status(500).json(error); // Send 500 for server errors
  }
};

module.exports = { resgisterUSer, loginUser, findUser, getUsers };