import mongoose from 'mongoose';
import { IBAN } from 'ibankit';
import accountSchema from '../mongoSchemas/accountSchema.js';
import AccountLogModel from './accountLogModel.js';



const Account = mongoose.model('Account', accountSchema);

class AccountModel {
  static async createAccount({ userId, currency, name}) {
    console.log('Creating account with data:', { userId, currency, name });
    const account = new Account({ userId, currency, name: name || 'Account' });
    return await account.save();
  }


  static async transferFunds(transactionData) {
      const session = await mongoose.startSession();
      session.startTransaction();
    try {
      const {fromIban, toIban, amount} = transactionData;

      const senderAccount = await Account.findOne({ accountNumber: fromIban }).session(session);
      const recipientAccount = await Account.findOne({ accountNumber: toIban }).session(session);

      if (!senderAccount) {
        const err = new Error('Sender account not found');
        err.status = 404;
        throw err
      }
      if (!recipientAccount) {
        const err = new Error('Recipient account not found');
        err.status = 404;
        throw err

      }
      if (senderAccount.balance < amount) {
        const err = new Error('Insufficient funds in sender account');
        err.status = 400;
        throw err
      }

      if (senderAccount.currency !== recipientAccount.currency) {
        const err = new Error('Currency mismatch between sender and recipient accounts');
        err.status = 400;
        throw err
      }

      if (fromIban === toIban) {
        const err = new Error('Sender and recipient IBANs cannot be the same');
        err.status = 400;
        throw err
      }

      await this.WithdrawFunds(fromIban, amount,session);
      await this.AddFunds(toIban, amount,session);



      await session.commitTransaction();
      session.endSession();
      return { senderAccount, recipientAccount };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }}

  static async AddFunds(iban, amount,session) {
    const account = await Account.findOne({ accountNumber: iban }).session(session);
    if (!account) {
      const err = new Error('Account not found');
      err.status = 404;
      throw err;
    }
    if(account.status !== 'active') {
      const err = new Error('Cannot add funds to an inactive or closed account');
      err.status = 400;
      throw err;
    }
    const beforeBalance = account.balance;

    account.balance += amount;
    const afterBalance = account.balance;
    const transactionData = {
      userId: account.userId,
      accountId: account._id,
      action: 'deposit',
      iban: account.accountNumber,
      beforeBalance: beforeBalance,
      afterBalance: afterBalance,
      description: `Deposited ${amount} ${account.currency}`
    };
    await AccountLogModel.createLog(transactionData,session);
    return await account.save();
  }

  static async WithdrawFunds(iban, amount,session) {
    const account = await Account.findOne({ accountNumber: iban }).session(session);
    if (!account) {
      const err = new Error('Account not found');
      err.status = 404;
      throw err;
    }
    if(account.status !== 'active') {
      const err = new Error('Cannot withdraw funds from an inactive or closed account');
      err.status = 400;
      throw err;
    }
    if (account.balance < amount) {
      const err = new Error('Insufficient funds');
      err.status = 400;
      throw err;
    }
    const beforeBalance = account.balance;

    const transactionData = {
      userId: account.userId,
      accountId: account._id,
      action: 'withdrawal',
      iban: account.accountNumber,
      beforeBalance: beforeBalance,
      afterBalance: beforeBalance - amount,
      description: `Withdrew ${amount} ${account.currency}`
    };
    await AccountLogModel.createLog(transactionData,session);
    account.balance -= amount;
    return await account.save();
  }

  static async findById(accountId) {
    return await Account.findById(accountId);
  }

  static async findByUserId(userId) {
    return await Account.find({ userId });
  }

  static async findByIban(iban) {
    return await Account.findOne({ accountNumber: iban });
  }


}

export default AccountModel;