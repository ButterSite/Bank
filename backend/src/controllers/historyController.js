import TransactionModel from "../models/transaction.js";


class HistoryController {
  
    static async getTransactionHistory(req, res,next) {
        try {
            const iban = req.account.accountNumber
            const { startDate, endDate } = req.query;
            if (!iban || !startDate || !endDate) {
                const error = new Error('Missing required fields');
                error.status = 400;
                throw error;
            }
            const transactions = await TransactionModel.getByIbanAndDate(iban, startDate, endDate);
            if(!transactions) {
                const error = new Error('No transactions found for this IBAN');
                error.status = 404;
                throw error;
            }
            res.status(200).json({ transactions });
        }catch(error) {
            next(error);
            console.log(`Error in getTransactionsByIban`, error)
        }
    }
}


export default HistoryController;
