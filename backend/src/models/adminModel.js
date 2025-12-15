import adminSchema from "../mongoSchemas/adminSchema.js";
import mongoose from "mongoose";

const Admin = mongoose.model("Admin", adminSchema);
class AdminModel {
  constructor() {
  }

  static async create(adminData) {
    adminData.role = 'admin';
    const admin = new Admin(adminData);
    return await admin.save();
  }


  static async findOne(filter) {
    return await Admin.findOne(filter);
  }

  static async findById(adminId) {
    return await Admin.findById(adminId);
  }

  static async findByUsername(username) {
    return await Admin.findOne({ username });
  };

  static async update(adminId, adminData) {
    return await Admin.findByIdAndUpdate(adminId, adminData, { new: true });
  }

  static async delete(adminId) {
    return await Admin.findByIdAndDelete(adminId);
  }
}

export default AdminModel;
