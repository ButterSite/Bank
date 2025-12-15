import AccountLogModel from "../models/accountLogModel.js";
import AdminModel from "../models/adminModel.js";
import { generateToken } from "../utils/jwtToken.js";

class AdminController {

  async loginAdmin(req, res, next) {
    try {
      const { username, password } = req.body;
      const admin = await AdminModel.findOne({ username });
      if (!admin) {
        const err = new Error('Admin not found');
        err.status = 404;
        throw err;
      }

      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        const err = new Error('Invalid username or password');
        err.status = 401;
        throw err;
      }
      const token = generateToken({ adminId: admin._id, role: admin.role });
      res.status(200).json({ success: true, message: 'Login successful', token: token  });

      
    } catch (error) {
      next(error);
    }
  }

  async createAdmin(req, res, next) {
    try {
      const adminData = req.body;
      const newAdmin = await AdminModel.create(adminData);
      res.status(201).json({ success: true, data: newAdmin });
    } catch (error) {
      next(error);
    }
  } 

  async getLogs(req, res, next) {
    try {
      const searchQuery = req.query;
      const logs = await AccountLogModel.getLogsByQuery(searchQuery);
      res.status(200).json({ success: true, data: logs });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
