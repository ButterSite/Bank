import mongoose from "mongoose";

const accountLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true
  },
  action: {
    type: String,
    enum: ["deposit", "withdrawal", "transfer"],
    required: true
  },
  iban: { type: String, required: true},
  beforeBalance: { type: Number, required: true },
  afterBalance: { type: Number, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
  
});


// Non-unique indexes for common filters
accountLogSchema.index({ accountId: 1, createdAt: -1 });
accountLogSchema.index({ userId: 1, createdAt: -1 });
accountLogSchema.index({ iban: 1, createdAt: -1 });


export default accountLogSchema;
