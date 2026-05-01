import mongoose from "mongoose";

const { Schema } = mongoose;

// 🏢 Organization Schema
const organizationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
      maxlength: 100,
      index: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    apiKeys: [
      {
        type: Schema.Types.ObjectId,
        ref: "ApiKey",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const organization = mongoose.model("Organization", organizationSchema);
export default organization;
