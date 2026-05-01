import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },

    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },
    skills: {
      type: String,
      trim: true,
      maxlength: 30,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/di77yygcs/image/upload/v1777048491/blog/csyh9zademalguzxpr9a.jpg",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
