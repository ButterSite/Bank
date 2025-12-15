import mongoose from 'mongoose';

import userSchema from '../mongoSchemas/userSchema.js';
import UserSavedRecipients from '../mongoSchemas/usersSavedRecipients.js';
const User = mongoose.model('User', userSchema);
class UserModel {




  static async createUser({ username, email,telephoneNumber, password, firstName, lastName }) {

    const user = new User({
      username,
      email,
      telephoneNumber,
      password,
      firstName,
      lastName,
      role: 'user',
    });

    return await user.save();
  }

  static async findUserById(userId) {

    const user = await User.findById(userId)
    return user;
  }

  static async loginUser({ username, password }) {

    const user = await User.findOne({ username });
    if (!user) {
      const err = new Error('Invalid username');
      err.status = 401;
      throw err;
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const err = new Error('Invalid password');
      err.status = 401;
      throw err;
    }
    return user;
  }

  static async saveRecipient(userId, recipientData) {
    const user = await User.findById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }

    // Ensure recipients is an array (fix legacy docs with wrong type)
    await UserSavedRecipients.updateOne(
      { userId },
      [
        {
          $set: {
            recipients: {
              $cond: [{ $isArray: "$recipients" }, "$recipients", []]
            }
          }
        }
      ],
      { upsert: true }
    );

    // Push the recipient only if IBAN doesn't already exist for this user
    await UserSavedRecipients.updateOne(
      { userId, 'recipients.iban': { $ne: recipientData.iban } },
      { $push: { recipients: { recipientName: recipientData.name, iban: recipientData.iban, currency: recipientData.currency } } }
    );

  }


  static async getSavedRecipients(userId) {
    const saved = await UserSavedRecipients.findOne({ userId });
    if (!saved) return [];
    return saved.recipients;
  }
}
export default UserModel;
