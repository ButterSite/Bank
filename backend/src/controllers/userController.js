import UserModel from '../models/user.js';
import AccountModel from '../models/accountModel.js';
import { generateToken } from '../utils/jwtToken.js';
import TransactionModel from '../models/transaction.js';
import { IBAN } from 'ibankit';
import { generateTransactionXml } from '../utils/transactionXml.js';
class UserController {




  static async register(req, res) {
    try {
      const { username, email, telephoneNumber, password, firstName, lastName, currency } = req.body;

      const user = await UserModel.createUser({
        username,
        email,
        telephoneNumber,
        password,
        firstName,
        lastName,
      });

      const account = await AccountModel.createAccount({
        userId: user._id,
        currency: currency || process.env.DEFAULT_CURRENCY || 'PLN',
      });

      const token = generateToken({ userId: user._id, role: user.role });


      res.status(201).json({
        message: 'User and account created successfully',
        userId: user._id,
        accountId: account._id,
        token: token
      });
    } catch (error) {
      if(error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(409).json({error: `${field.charAt(0).toUpperCase() + field.slice(1)} already in use`})
      }
      res.status(400).json({ error: error.message });
      console.error('Error in createUser:', error.message);
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;
      console.log('Login attempt:', { username });
      if (typeof username !== 'string') {
        return res.status(400).json({ error: 'Username must be a string' });
      }
      const user = await UserModel.loginUser({ username, password });
      const token = generateToken({ userId: user._id, role: user.role });
      console.log("Login successful, generated token:", token);
      res.status(200).json({ success: true, token: token  });
    } catch (error) {
      console.error('Error in login:', error.message);
      res.status(401).json({ error: error.message });
    }
  }


  static async getSavedRecipients(req, res,next) {
    try {
      const userId = req.user.userId;
      const recipients = await UserModel.getSavedRecipients(userId);
      if (!recipients) {
        const err = new Error('User not found');
        err.status = 404;
        throw err;
      }
      res.status(200).json({ success: true, recipients: recipients });
    } catch (error) {


      next(error);
    }
  }


  static async logout(req, res) {
    try {
      res.clearCookie("token", {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: "Lax",
      }).status(200).json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default UserController;