import mongoose from 'mongoose';
import { IBAN } from 'ibankit';
import Decimal from 'decimal.js';
import transactionSchema from '../mongoSchemas/transactionSchema.js';


const Transaction = mongoose.model('Transaction', transactionSchema);

class TransactionModel {

    static async findTransaction(transactionId) {
      return await Transaction.findOne({transactionId: transactionId})
    };



    static async getByIbanAndDate(iban, startDate, endDate) {
     const query = {
      $or: [{ fromIban: iban }, { toIban: iban }],
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
    return await Transaction.find(query);
    }

    static async findByIban(iban) {
      return await Transaction.find(iban);
    }

    static async findByUserId(userId) {
      return await Transaction.find({ userId: userId });
    }



    static async createTransaction(transactionData) {
        const {
            senderId, currency, 
            fromIban,toIban,
            senderName,
            recipientName,
            description,
            amount
        } = transactionData;
        const transaction = new Transaction({
            senderId: senderId,
            currency: currency,
            fromIban: fromIban,
            toIban: toIban,
            senderName: senderName,
            recipientName: recipientName,
            recipientId: null,
            description: description || process.env.DEFAULT_TRANSACTION_DESCRIPTION || 'Transaction',
            amount: new Decimal(amount).toFixed(2),
          });

        return await transaction.save()
    }

}

export default TransactionModel;


