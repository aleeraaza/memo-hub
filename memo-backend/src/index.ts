import express from "express";
import { UserModel } from "./db.js";
import { z } from "zod";
import bcrypt from "bcryptjs";

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
      message: "user created successfully",
      userId: user._id,
    });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({
      message: "Something went Wrong :(",
    });
  }
});

app.listen(port);
