import mongoose from 'mongoose';
import { IBAN } from 'ibankit';
import Decimal from 'decimal.js';
const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true,
    required: true,
    default: function () {
      return `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    },
  },

  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, 
  },


  senderName: {
    type: String,
    required: true,
    trim: true,
  },
  recipientName: {
    type: String,
    required: true,
    trim: true,
  },

  fromIban: {
    type: String,
    required: true,
    validate: {
      validator: (value) => IBAN.isValid(value),
      message: 'Invalid sender IBAN format',
    },
  },


  toIban: {
    type: String,
    required: true,
    validate: {
      validator: (value) => IBAN.isValid(value),
      message: 'Invalid recipient IBAN format',
    },
  },

  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    min: 0.01,
    get: (v) => (v ? new Decimal(v.toString()).toFixed(2) : v), 
  },

  currency: {
    type: String,
    required: true,
    enum: ['PLN', 'EUR', 'USD'],
    default: process.env.DEFAULT_CURRENCY || 'PLN',
  },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'rejected', 'failed'],
    default: 'pending',
  },

  createdAt: {
    type: Date,
    default: Date.now,
    get: (v) => v.toISOString(),
  },

  description: {
    type: String,
    default: process.env.DEFAULT_TRANSACTION_DESCRIPTION || 'Transaction',
    maxlength: 140,
    trim: true,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: { getters: true },
});

transactionSchema.pre('save', async function (next) {
  this.updatedAt = Date.now();
  const Account = mongoose.model('Account');
  const recipientAccount = await Account.findOne({ accountNumber: this.toIban });
  if (recipientAccount && !this.recipientId) {
    this.recipientId = recipientAccount.userId;
  }

  next();
});


export default transactionSchema