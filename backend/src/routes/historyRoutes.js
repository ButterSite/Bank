
import express from 'express';
import HistoryController from '../controllers/historyController.js';
import { authToken } from '../middleware/auth.js';
import CheckPermissions from '../middleware/checkPermissions.js';

const historyRouter = express.Router();





historyRouter.get(`/`,authToken,CheckPermissions.checkAccountOwnership,HistoryController.getTransactionHistory)



export default historyRouter;