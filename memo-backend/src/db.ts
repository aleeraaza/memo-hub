import mongoose, { model, Schema } from "mongoose";

mongoose.connect(
  "mongodb+srv://alirazakh755:RdrrrD10gwROAE6h@cluster0.1ensoaq.mongodb.net/memoHub"
);

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const UserModel = model("User", UserSchema);

const contentType = ["image", "audio", "video", "article"];

const ContentSchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: contentType, required: true },
  link: { type: String, required: true },
  tag: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

export const ContentModel = model("Content", ContentSchema);
