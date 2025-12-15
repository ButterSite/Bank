import AccountModel from "../models/accountModel.js";



class TransactionsAuth {

  
    static setModel(model) {
        return (req, res, next) => {
        req.model = model;
        next();
        };
    };



    static checkAccountOwnership = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const fromIban = req.body.fromIban|| req.params.fromIban || req.query.iban;
            if(!userId) {
                return res.status(404).json({ error: 'Missing parameters' });
            }
            if (!fromIban) {
            return res.status(404).json({ error: 'Missing parameters' });
            };
            const account = await AccountModel.findByIban(fromIban);
            if (!account) {
            return res.status(404).json({ error: 'Account not found' });
            };

            if (account.userId.toString() !== userId) {
            return res.status(403).json({ error: 'You do not own this account' });
            };
            req.account = account;
            next();
        }catch (error) {
            next(error);
        }
        
    };
};

export default TransactionsAuth;