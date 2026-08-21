import Expense from '../models/Expense.js';
import Income from '../models/Income.js';

// @desc    Get unified transactions (both income & expenses) with filters, search & pagination
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res, next) => {
  try {
    const {
      type = 'all', // 'all', 'income', 'expense'
      search = '',
      category = 'All',
      startDate,
      endDate,
      sortBy = 'date_desc',
      page = 1,
      limit = 10,
    } = req.query;

    const userId = req.user._id;

    // Build Expense query
    const expenseQuery = { user: userId };
    // Build Income query
    const incomeQuery = { user: userId };

    // Search filter
    if (search && search.trim() !== '') {
      expenseQuery.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
      incomeQuery.$or = [
        { source: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Category filter (only applies to expenses or income if matching)
    if (category && category !== 'All') {
      expenseQuery.category = category;
      // If filtering by a specific category, income typically doesn't match unless it's Income
      incomeQuery.source = category;
    }

    // Date range filter
    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) {
        dateFilter.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.$lte = end;
      }
      expenseQuery.date = dateFilter;
      incomeQuery.date = dateFilter;
    }

    let expenses = [];
    let incomes = [];

    if (type === 'all' || type === 'expense') {
      expenses = await Expense.find(expenseQuery);
    }
    if (type === 'all' || type === 'income') {
      incomes = await Income.find(incomeQuery);
    }

    // Normalize items
    const formattedExpenses = expenses.map((item) => ({
      _id: item._id,
      type: 'expense',
      title: item.title,
      amount: item.amount,
      category: item.category,
      paymentMethod: item.paymentMethod,
      date: item.date,
      description: item.description,
      createdAt: item.createdAt,
    }));

    const formattedIncomes = incomes.map((item) => ({
      _id: item._id,
      type: 'income',
      title: item.source,
      amount: item.amount,
      category: 'Income',
      paymentMethod: 'Direct / Deposit',
      date: item.date,
      description: item.description,
      createdAt: item.createdAt,
    }));

    let allTransactions = [...formattedExpenses, ...formattedIncomes];

    // Sorting
    allTransactions.sort((a, b) => {
      if (sortBy === 'date_asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'date_desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'amount_asc') return a.amount - b.amount;
      if (sortBy === 'amount_desc') return b.amount - a.amount;
      return new Date(b.date) - new Date(a.date);
    });

    const total = allTransactions.length;
    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;
    const paginatedTransactions = allTransactions.slice(skip, skip + pageSize);

    // Summary calculations
    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    const netBalance = totalIncome - totalExpense;

    res.status(200).json({
      success: true,
      data: paginatedTransactions,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize) || 1,
        limit: pageSize,
      },
      summary: {
        totalIncome,
        totalExpense,
        netBalance,
        totalCount: total,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export all transactions without pagination
// @route   GET /api/transactions/export
// @access  Private
export const exportTransactions = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [expenses, incomes] = await Promise.all([
      Expense.find({ user: userId }).sort({ date: -1 }),
      Income.find({ user: userId }).sort({ date: -1 }),
    ]);

    const formattedExpenses = expenses.map((item) => ({
      id: item._id.toString(),
      type: 'Expense',
      title: item.title,
      amount: item.amount,
      category: item.category,
      paymentMethod: item.paymentMethod,
      date: item.date.toISOString().split('T')[0],
      description: item.description || '',
    }));

    const formattedIncomes = incomes.map((item) => ({
      id: item._id.toString(),
      type: 'Income',
      title: item.source,
      amount: item.amount,
      category: 'Income',
      paymentMethod: 'Direct / Deposit',
      date: item.date.toISOString().split('T')[0],
      description: item.description || '',
    }));

    const transactions = [...formattedExpenses, ...formattedIncomes].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};
