import mongoose from 'mongoose';
import Transaction from './models/Transaction.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Check if MONGO_URI is defined
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      // Fetch all transactions
      const transactions = await Transaction.find();
      console.log(`Found ${transactions.length} transactions`);

      // Update transactions with user_id to use user
      let updatedCount = 0;
      for (const transaction of transactions) {
        if (transaction.user_id && !transaction.user) {
          transaction.user = transaction.user_id;
          transaction.user_id = undefined;
          await transaction.save();
          console.log(`Updated transaction ${transaction._id}`);
          updatedCount++;
        }
      }

      console.log(`Migration complete. Updated ${updatedCount} transactions.`);
    } catch (error) {
      console.error('Migration error:', error);
    } finally {
      // Close the MongoDB connection
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
      process.exit(0);
    }
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });