import express from 'express';
import TransactionController from '../controllers/transactionController.js';
import { authToken } from '../middleware/auth.js';
import CheckPermissions from '../middleware/checkPermissions.js';
const transactionRouter = express.Router();

transactionRouter.use(express.text({ type: 'application/xml' }));

transactionRouter.post(`/incoming`,TransactionController.incomingTransaction);

transactionRouter.post(`/make-transaction`,authToken,CheckPermissions.checkAccountOwnership,TransactionController.makeTransaction);










export default transactionRouter