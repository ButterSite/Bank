
import express from 'express';
import AccountsController from '../controllers/accountsController.js';
import { authToken } from '../middleware/auth.js';

const accountRouter = express.Router();


accountRouter.post('/create', authToken, AccountsController.createAccount);


accountRouter.get('/', authToken, AccountsController.getAccountByUserId);






export default accountRouter;



