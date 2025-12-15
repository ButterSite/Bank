import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';
import { IBAN } from 'ibankit';
import { name } from '@adminjs/express';
const AutoIncrement = AutoIncrementFactory(mongoose);
const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      const countryCode = process.env.IBAN_COUNTRY_CODE || 'DE';
      const bankCode = process.env.IBAN_BANK_CODE || '10100000';
      const accountSeq = this._accountSeq || Math.floor(Math.random() * 1000000) + 1;
      const accountLength = parseInt(process.env.IBAN_ACCOUNT_LENGTH) || 16;

      const accountNum = accountSeq.toString().padStart(accountLength, '0');
      const bban = `${bankCode}${accountNum}`;
      const iban = IBAN.fromBBAN(countryCode, bban);
      return iban.toString();
    },
    validate: {
      validator: (value) => IBAN.isValid(value),
      message: 'Invalid IBAN format',
    },
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  currency: {
    type: String,
    enum: ['PLN', 'EUR', 'USD'],
    default: 'EUR',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'closed'],
    default: 'active',
  },
  name: {
    type: String,
    default: 'Account',
  },
});

accountSchema.plugin(AutoIncrement, { id: 'account_seq', inc_field: '_accountSeq', start_seq: 1 });

accountSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});


export default accountSchema