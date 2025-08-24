import mongoose, { model, Schema } from "mongoose";

mongoose.connect(
  "mongodb+srv://alirazakh755:RdrrrD10gwROAE6h@cluster0.1ensoaq.mongodb.net/memoHub"
);

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: { type: String, unique: false },
});

export const UserModel = model("User", UserSchema);
