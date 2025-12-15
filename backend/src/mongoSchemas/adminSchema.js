import mongoose from "mongoose";
import bcrypt from 'bcrypt';


const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['admin'],
    default: 'admin'
  }
});


adminSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

adminSchema.methods.updateLastLogin = async function () {
  this.lastLogin = Date.now();
  await this.save();
};

adminSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  if (isMatch) {
    this.updateLastLogin();
  }
  return isMatch;
};




export default adminSchema;