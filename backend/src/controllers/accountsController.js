import AccountModel from "../models/accountModel.js";


class AccountsController {


    static async createAccount(req, res,next) {
        try {
            const { userId } = req.user;
            const { currency, name } = req.body;
            if(!userId) {
                const err = new Error("Missing userId");
                err.status = 400;
                throw err;
            }
     
            if(!currency) {
                const err = new Error("Missing currency");
                err.status = 400;
                throw err;
            }

            const newAccount = await AccountModel.createAccount({userId, currency, name});
            if(!newAccount) {
                const err = new Error("Error with creating account");
                err.status = 500;
                throw err;
                return;
            }
            res.status(201).json({message: "Account created successfully", account: newAccount});
   
        }
        catch(error) {
            next(error);
        }

    }
    static async getAccountByUserId(req,res,next) {
    try {
      const {userId} = req.user;
      const accounts = await AccountModel.findByUserId(userId);
      if(!accounts || accounts.length === 0) {
        const err = new Error(`No accounts found on this user ID`);
        err.status = 404;
        throw err;
      }
      res.status(200).json({message: `Success`, accounts: accounts});

    }catch(error) {
      console.log(`Error in getAccount:`, error.message);
      next(error);

    };
  };


}


export default AccountsController;