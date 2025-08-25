import express from "express";
import { ContentModel, UserModel } from "./db.js";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";
import { userMiddleware } from "./middleware.js";

const port = 3000;

const app = express();

app.use(express.json());

const signupSchema = z.object({
  username: z.string().min(3, "username must be of 3 characters"),
  password: z
    .string()
    .min(8, "password must be of 8 characters")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least 1 special character"
    ),
});
const contentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["video", "article", "image", "audio"]),
  link: z.string().url("Invalid URL format"), // still works but flagged
});

app.post("/api/v1/signup", async (req, res) => {
  try {
    //zod validaton
    const { username, password } = signupSchema.parse(req.body);

    //hash the password
    const hashedPass = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      username,
      password: hashedPass,
    });

    res.status(201).json({
      message: "user created successfully...",
      userId: user._id,
    });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({
      message: "Something went Wrong :(",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    // basic body check
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password required" });
    }

    const existingUser = await UserModel.findOne({ username });

    if (!existingUser) {
      return res.status(403).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(403).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: existingUser._id, username }, JWT_PASSWORD, {
      expiresIn: "1h",
    });

    return res.json({ token });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const title = req.body.title;
  const type = req.body.type;
  const link = req.body.link;

  const content = await ContentModel.create({
    title,
    type,
    link,
    userId: req.userId,
  });

  res.json({
    message: "Content Added in DB!",
  });
});

app.listen(port);
