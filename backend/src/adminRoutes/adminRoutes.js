import express from 'express';
import AdminController from '../adminControllers/adminController.js';
import { authToken } from '../middleware/auth.js';
import CheckPermissions from '../middleware/checkPermissions.js';

const adminRouter = express.Router();

adminRouter.get(
	"/logs",
	authToken,
	CheckPermissions.checkRole(['admin']),
	AdminController.getLogs
);


adminRouter.post('/login',AdminController.loginAdmin);

adminRouter.post('/create',AdminController.createAdmin);

adminRouter.get('/logs',authToken,CheckPermissions.checkRole(['admin']),AdminController.getLogs);



export default adminRouter