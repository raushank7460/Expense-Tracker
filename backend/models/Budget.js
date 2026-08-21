import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a category for budget'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide budget amount limit'],
      min: [1, 'Budget amount must be at least 1'],
    },
    month: {
      type: Number,
      required: [true, 'Please specify the month (1-12)'],
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: [true, 'Please specify the year'],
      min: 2000,
      max: 2100,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique budget per user, category, month, and year
budgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);
export default Budget;
