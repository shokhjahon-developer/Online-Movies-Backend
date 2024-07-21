const { createToken } = require("../utils/jwt");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const prisma = require("../utils/connection");
const sendMail = require("../utils/mailer");
const { createClient } = require("redis");

const client = createClient(6379);

client.connect().then(() => console.log("Redis client connected"));

const register = async (req, res, next) => {
  try {
    const { email } = req.body;

    const check = Joi.object({
      email: Joi.string().email().required(),
    });

    const { error } = check.validate({ email });
    if (error) return res.status(400).json({ message: error.message });

    const user = await prisma.users.findUnique({ where: { email } });

    if (user) {
      return res
        .status(403)
        .json({ message: "You have already registered with this email!" });
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await client.setEx(`otp:${email}`, 120, otp);

    await sendMail(email, otp);

    res.status(201).json({
      message: "To complete registration, please verify your email",
      data: req.body,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const verify = Joi.object({
      email: Joi.string().min(6).required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = verify.validate({ email, password });
    if (error) return res.status(400).json({ message: error.message });

    const findUser = await prisma.users.findUnique({ where: { email } });

    if (!findUser) {
      return res.status(403).json({ message: "Incorrect password or email!" });
    }

    const check = await bcrypt.compare(password, findUser.password);

    if (!check) {
      return res.status(403).json({ message: "Incorrect password or email!" });
    }

    const token = createToken({ id: findUser.id, isAdmin: findUser.isAdmin });
    res.cookie("token", token);

    res.json({ message: "You are successfully logged in!", data: token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { code, fullName, email, password } = req.body;

    const check = Joi.object({
      code: Joi.string().min(6).required(),
      fullName: Joi.string().min(6).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(12).required(),
    });

    const { error } = check.validate({ fullName, email, password, code });
    if (error) return res.status(400).json({ message: error.message });

    const storedOtp = await client.get(`otp:${email}`);

    if (storedOtp !== code) {
      return res.status(403).json({ message: "Invalid OTP or OTP expired!" });
    }

    const user = await prisma.users.findUnique({ where: { email } });

    if (user) {
      return res
        .status(403)
        .json({ message: "You have already registered with this email!" });
    }

    const hashedPass = await bcrypt.hash(password, 12);

    const newUser = await prisma.users.create({
      data: { fullName, email, password: hashedPass },
    });

    const token = createToken({
      id: newUser.id,
      isAdmin: newUser.isAdmin,
    });
    res.cookie("token", token);

    res.status(201).json({ message: "Success", data: token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  register,
  login,
  verify,
};
