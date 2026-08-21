import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';

// @desc    Create or update a budget for a category, month and year
// @route   POST /api/budgets
// @access  Private
export const setBudget = async (req, res, next) => {
  try {
    const { category, amount, month, year } = req.body;

    if (!category || !amount || !month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category, amount, month, and year',
      });
    }

    const budgetMonth = parseInt(month, 10);
    const budgetYear = parseInt(year, 10);

    // Upsert budget for this user, category, month, and year
    const budget = await Budget.findOneAndUpdate(
      {
        user: req.user._id,
        category: category.trim(),
        month: budgetMonth,
        year: budgetYear,
      },
      {
        user: req.user._id,
        category: category.trim(),
        amount: Number(amount),
        month: budgetMonth,
        year: budgetYear,
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({
      success: true,
      message: 'Budget set successfully',
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all budgets for a given month and year with calculated spending & percentages
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const month = req.query.month ? parseInt(req.query.month, 10) : currentDate.getMonth() + 1;
    const year = req.query.year ? parseInt(req.query.year, 10) : currentDate.getFullYear();

    const budgets = await Budget.find({
      user: req.user._id,
      month,
      year,
    });

    // Date range for this month & year
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // Aggregate expenses for this month grouped by category
    const expenseAggregates = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          spent: { $sum: '$amount' },
        },
      },
    ]);

    const expenseMap = {};
    expenseAggregates.forEach((item) => {
      expenseMap[item._id] = item.spent;
    });

    let totalBudgetAmount = 0;
    let totalSpentAmount = 0;

    const budgetsWithDetails = budgets.map((b) => {
      const spent = expenseMap[b.category] || 0;
      const remaining = b.amount - spent;
      const percentage = b.amount > 0 ? Math.round((spent / b.amount) * 100) : 0;

      let status = 'safe'; // < 75%
      if (percentage >= 100) {
        status = 'exceeded';
      } else if (percentage >= 75) {
        status = 'warning';
      }

      totalBudgetAmount += b.amount;
      totalSpentAmount += spent;

      return {
        _id: b._id,
        category: b.category,
        amount: b.amount,
        month: b.month,
        year: b.year,
        spent,
        remaining,
        percentage,
        status,
        createdAt: b.createdAt,
      };
    });

    res.status(200).json({
      success: true,
      data: budgetsWithDetails,
      meta: {
        month,
        year,
        totalBudget: totalBudgetAmount,
        totalSpent: totalSpentAmount,
        totalRemaining: totalBudgetAmount - totalSpentAmount,
        overallPercentage:
          totalBudgetAmount > 0 ? Math.round((totalSpentAmount / totalBudgetAmount) * 100) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = async (req, res, next) => {
  try {
    const { amount, category } = req.body;

    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found or unauthorized',
      });
    }

    if (amount !== undefined) budget.amount = Number(amount);
    if (category !== undefined) budget.category = category.trim();

    const updatedBudget = await budget.save();

    res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      data: updatedBudget,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found or unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Budget deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
