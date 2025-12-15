import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import UserSavedRecipients from './usersSavedRecipients.js';
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    telephoneNumber: {type: String, required: true,unique: true},
    password: { type: String, required: true, minlength: 8 },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    UserSavedRecipients: { type: mongoose.Schema.Types.ObjectId, ref: 'UserSavedRecipients' }
  });

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password,10);
    }
    this.updatedAt = Date.now();
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default userSchema;