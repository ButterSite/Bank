import mongoose from "mongoose";
import AccountLogSchema from "../mongoSchemas/accountLogsSchema.js";

const AccountLog = mongoose.model("AccountLog", AccountLogSchema);

class AccountLogModel {

  static async createLog(transactionData,session = null) {
    const { userId, accountId, action, iban, beforeBalance, afterBalance, description } = transactionData;
    const log = new AccountLog({
      userId: userId,
      accountId: accountId,
      action: action,
      iban: iban,
      beforeBalance:beforeBalance,
      afterBalance:afterBalance,
      description
    })
    return await log.save(session ? { session } : {});
  };

  static async getLogsByAccountId(accountId) {
    return await AccountLog.find({ accountId }).sort({ timestamp: -1 });
  };

  static async getAllLogs() {
    return await AccountLog.find()
  };

  static async getLogsByQuery(query) {
    const { userId, accountId, iban, action, startDate, endDate, limit, skip } = query || {};

    const filter = {};
    if (userId) filter.userId = userId;
    if (accountId) filter.accountId = accountId;
    if (iban) filter.iban = iban;
    if (action) filter.action = action;

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    const parsedLimit = Number.isNaN(Number(limit)) ? undefined : Number(limit);
    const parsedSkip = Number.isNaN(Number(skip)) ? undefined : Number(skip);

    return await AccountLog.find(filter)
      .sort({ timestamp: -1 })
      .skip(parsedSkip || 0)
      .limit(parsedLimit || 100);
  }
}


export default AccountLogModel;