import mongoose from 'mongoose';

const incomeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    source: {
      type: String,
      required: [true, 'Please provide an income source'],
      trim: true,
      maxlength: [100, 'Source cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an income amount'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide the income date'],
      default: Date.now,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user + date querying
incomeSchema.index({ user: 1, date: -1 });

const Income = mongoose.model('Income', incomeSchema);
export default Income;
