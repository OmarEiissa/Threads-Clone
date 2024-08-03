import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true, // إزالة المسافات الزائدة في البداية والنهاية
      match: /^[a-zA-Z0-9_]+$/ // تحديد القيم المقبولة (حروف، أرقام، وشرطات سفلية فقط)
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    followers: {
      type: [String],
      default: [],
    },
    following: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  this.userName = this.userName.replace(/\s+/g, '').toLowerCase();
  this.email = this.email.toLowerCase();
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
