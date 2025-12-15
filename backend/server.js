import express from 'express';
import cors from 'cors';
import userRouter from './src/routes/userRoutes.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import transactionRouter from './src/routes/transactionRoutes.js';
import historyRouter from './src/routes/historyRoutes.js';
import accountRouter from './src/routes/accountRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './src/config/swagger.js';
import adminRouter from './src/adminRoutes/adminRoutes.js';


dotenv.config();

const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
};

class ServerCommunication {
  constructor() {
    console.log('Initializing server...');
    this.app = express();
    this.PORT = process.env.PORT || 3000;
  
    console.log('Setting up middleware...');
    this.app.use(cors({
    // origin: "http://localhost:5173",
    // credentials: true,             
  }));
  this.app.use(express.json());
    this.app.use('/users', userRouter);
    this.app.use(`/transactions`,transactionRouter);
    this.app.use(`/history`,historyRouter);
    this.app.use(`/accounts`,accountRouter);
    this.app.use(express.text({ type: 'application/xml' }));
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    this.app.use('/admin',adminRouter);

    this.app.use(errorHandler);
  }


  async start() {
    try {
      console.log('Connecting to MongoDB:', process.env.MONGO_URI);
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected');

      // One-time index maintenance for account logs: remove accidental unique index on IBAN
      try {
        const coll = mongoose.connection.db.collection('accountlogs');
        const indexes = await coll.indexes();
        const ibanUnique = indexes.find((i) => i.name === 'iban_1' && i.unique);
        if (ibanUnique) {
          console.warn('Dropping unique index iban_1 from accountlogs to allow multiple logs per IBAN...');
          await coll.dropIndex('iban_1');
          // Recreate a helpful non-unique index
          await coll.createIndex({ iban: 1, createdAt: -1 }, { name: 'iban_1' });
          console.log('Recreated non-unique index on { iban, createdAt }');
        }
      } catch (idxErr) {
        console.warn('Index maintenance skipped:', idxErr?.message || idxErr);
      }

      console.log('Starting server...');
      this.app.listen(this.PORT, () => {
        console.log(`Server started on port ${this.PORT}`);
      });
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }
}

const server = new ServerCommunication();
server.start();


// server.start()


    // const app = express();
    // app.use(cors);
    // app.use(express.json());
    // app.use(`/api/users`,userRouter)
    // console.log('Initializing server...');

    // try {

    //     console.log('Connecting to MongoDB:', process.env.MONGO_URI);
    //     await mongoose.connect(process.env.MONGO_URI)
    //     .then(() => console.log('MongoDB connected'))
    //     .catch((err) => console.error('MongoDB connection error:', err));

    //     app.get('/test', (req, res) => {
    //         console.log(123)
    //         res.status(200).json({ message: 'Server works!' });
    //       });

    //     app.listen(process.env.PORT, () => {
    //         console.log(`Server started on port ${process.env.PORT}`)
    //     })
    // }catch(error) {
    //     console.log(error);
    //     throw error
    // }






// import express from 'express';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.get('/test', (req, res) => {
//   console.log('GET /test hit');
//   res.status(200).json({ message: 'Server works!' });
// });

// app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });