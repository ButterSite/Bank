import { generateTransactionXml, parseXmlPacs008 } from "../utils/transactionXml.js";
import TransactionModel from '../models/transaction.js';
import AccountModel from "../models/accountModel.js";
import UserModel from "../models/user.js";

class TransactionController {




    static async makeTransaction(req, res,next) {
        try {
            const {recipientName, fromIban,toIban,amount,currency,description} = req.body;
            const {saveRecipients} = req.body;
            if (saveRecipients) {
                await UserModel.saveRecipient(req.user.userId, { name: recipientName, iban: toIban , currency: currency});
            }


            if (!fromIban || !toIban || !amount || !currency) {
            return res.status(400).json({ error: 'Missing required fields' });
            }

            if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: 'Amount must be a positive number' });
            }
            const senderId = req.user.userId;
            console.log('Sender ID:', senderId);
            const senderAccount = await UserModel.findUserById(senderId);
            if(!senderAccount) {
                const error = new Error('Sender account not found');
                error.status = 404;
                throw error;
            }
            
   
            
            const transactionData = {
            senderId: senderId, 
            currency: currency, 
            fromIban: fromIban,
            toIban: toIban,
            senderName: `${senderAccount.firstName} ${senderAccount.lastName}`,
            recipientName: recipientName,
            description: description,
            amount: amount,
            status: "completed"
            }

            await AccountModel.transferFunds(transactionData);


            const transaction = await TransactionModel.createTransaction(transactionData);
            if(!transaction) {
                const error = new Error('Transaction creation failed');
                error.status = 500;
                throw error;
            }


            const transactionXml = generateTransactionXml(transaction);
            
            res.status(201).json({
            message: 'Transaction successful',
            transactionId: transaction.transactionId,
            amount: transaction.amount,
            currency: transaction.currency,
            status: transaction.status,
            xml: transactionXml
            });
        }catch(error) {
            next(error);
            console.log(`Error in sendTransaction`, error)
        }
    }

    static async incomingTransaction(req,res) {
        try {
            const xml = req.body;
            if(!xml) {
                throw new Error('No XML data provided')
            }
            const transactionData = parseXmlPacs008(xml)
            const transaction = await TransactionModel.createTransaction(transactionData);
            if(!transaction) {
                throw new Error('Failed to create a transaction');
            }
            const recipientIban = transactionData.toIban;
            const amount = parseFloat(transactionData.amount);
            await AccountModel.AddFunds(recipientIban, amount);
            const responseXml = create({ version: '1.0', encoding: 'UTF-8' })
                .ele('Ack')
                .ele('MsgId').txt(`ACK-${transactionData.transactionId}`).up()
                .ele('Status').txt('Received').up()
                .up()
                .end({ prettyPrint: true });
            res.set('Content-Type', 'application/xml');
            res.status(200).send(responseXml);
        }catch(error) {
            const errorXml = create({ version: '1.0', encoding: 'UTF-8' })
                .ele('Error')
                .ele('Message').txt(error.message).up()
                .up()
                .end({ prettyPrint: true });
        
            res.set('Content-Type', 'application/xml');
            res.status(400).send(errorXml);
        }

    }

}




export default TransactionController;