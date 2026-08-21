import Expense from '../models/Expense.js';
import Income from '../models/Income.js';
import Budget from '../models/Budget.js';

// Helper to calculate date range based on period
const getDateRangeForPeriod = (period, startDateQuery, endDateQuery) => {
  const now = new Date();
  let start = new Date();
  let end = new Date();

  if (period === 'today') {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (period === 'this_week') {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
    start = new Date(now.setDate(diff));
    start.setHours(0, 0, 0, 0);
    end = new Date();
    end.setHours(23, 59, 59, 999);
  } else if (period === 'this_month') {
    start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  } else if (period === 'this_year') {
    start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
  } else if (period === 'custom' && startDateQuery) {
    start = new Date(startDateQuery);
    start.setHours(0, 0, 0, 0);
    if (endDateQuery) {
      end = new Date(endDateQuery);
      end.setHours(23, 59, 59, 999);
    } else {
      end = new Date();
      end.setHours(23, 59, 59, 999);
    }
  } else {
    // All time default or 1 year back
    start = new Date(0);
    end = new Date();
    end.setHours(23, 59, 59, 999);
  }

  return { start, end };
};

// @desc    Get top level summary KPIs
// @route   GET /api/analytics/summary
// @access  Private
export const getSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { period = 'all', startDate, endDate } = req.query;

    const dateFilter = {};
    if (period !== 'all' || startDate) {
      const range = getDateRangeForPeriod(period, startDate, endDate);
      dateFilter.date = { $gte: range.start, $lte: range.end };
    }

    const [incomeAgg, expenseAgg, expenseCount, incomeCount, topCategoryAgg, largestExpense] =
      await Promise.all([
        Income.aggregate([
          { $match: { user: userId, ...dateFilter } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        Expense.aggregate([
          { $match: { user: userId, ...dateFilter } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        Expense.countDocuments({ user: userId, ...dateFilter }),
        Income.countDocuments({ user: userId, ...dateFilter }),
        Expense.aggregate([
          { $match: { user: userId, ...dateFilter } },
          { $group: { _id: '$category', total: { $sum: '$amount' } } },
          { $sort: { total: -1 } },
          { $limit: 1 },
        ]),
        Expense.findOne({ user: userId, ...dateFilter }).sort({ amount: -1 }),
      ]);

    const totalIncome = incomeAgg[0]?.total || 0;
    const totalExpense = expenseAgg[0]?.total || 0;
    const netBalance = totalIncome - totalExpense;
    const totalTransactions = expenseCount + incomeCount;
    const savingsRate =
      totalIncome > 0
        ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100))
        : 0;

    const highestCategory = topCategoryAgg[0]
      ? { category: topCategoryAgg[0]._id, amount: topCategoryAgg[0].total }
      : { category: 'None', amount: 0 };

    res.status(200).json({
      success: true,
      data: {
        totalBalance: netBalance,
        totalIncome,
        totalExpenses: totalExpense,
        savings: netBalance > 0 ? netBalance : 0,
        savingsRate,
        totalTransactions,
        expenseCount,
        incomeCount,
        highestSpendingCategory: highestCategory,
        largestExpense: largestExpense
          ? { title: largestExpense.title, amount: largestExpense.amount, date: largestExpense.date }
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly breakdown (last 12 months or selected range)
// @route   GET /api/analytics/monthly
// @access  Private
export const getMonthlyAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Last 12 months rolling
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 11);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const [monthlyExpenses, monthlyIncome] = await Promise.all([
      Expense.aggregate([
        {
          $match: {
            user: userId,
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' },
            },
            totalExpense: { $sum: '$amount' },
          },
        },
      ]),
      Income.aggregate([
        {
          $match: {
            user: userId,
            date: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' },
            },
            totalIncome: { $sum: '$amount' },
          },
        },
      ]),
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = [];

    // Generate consecutive 12 months
    const cursor = new Date(startDate);
    while (cursor <= endDate) {
      const year = cursor.getFullYear();
      const month = cursor.getMonth() + 1;
      const monthLabel = `${monthNames[month - 1]} ${year}`;

      const expItem = monthlyExpenses.find(
        (e) => e._id.year === year && e._id.month === month
      );
      const incItem = monthlyIncome.find(
        (i) => i._id.year === year && i._id.month === month
      );

      const income = incItem?.totalIncome || 0;
      const expense = expItem?.totalExpense || 0;
      const savings = income - expense;

      result.push({
        month: monthLabel,
        year,
        monthNum: month,
        income,
        expense,
        savings: savings > 0 ? savings : 0,
        net: savings,
      });

      cursor.setMonth(cursor.getMonth() + 1);
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category-wise distribution & percentages
// @route   GET /api/analytics/category
// @access  Private
export const getCategoryAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { period = 'this_month', startDate, endDate } = req.query;

    const dateFilter = {};
    if (period !== 'all' || startDate) {
      const range = getDateRangeForPeriod(period, startDate, endDate);
      dateFilter.date = { $gte: range.start, $lte: range.end };
    }

    const categoryBreakdown = await Expense.aggregate([
      { $match: { user: userId, ...dateFilter } },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    const totalExpense = categoryBreakdown.reduce((sum, item) => sum + item.totalAmount, 0);

    const formatted = categoryBreakdown.map((item) => ({
      category: item._id,
      amount: item.totalAmount,
      count: item.count,
      percentage: totalExpense > 0 ? Math.round((item.totalAmount / totalExpense) * 100) : 0,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
      totalExpense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dynamic insights and financial health check
// @route   GET /api/analytics/insights
// @access  Private
export const getInsights = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const [
      thisMonthExpenses,
      lastMonthExpenses,
      thisMonthIncome,
      activeBudgets,
      categoryDistribution,
    ] = await Promise.all([
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: thisMonthStart } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: lastMonthStart, $lte: lastMonthEnd } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Income.aggregate([
        { $match: { user: userId, date: { $gte: thisMonthStart } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Budget.find({
        user: userId,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      }),
      Expense.aggregate([
        { $match: { user: userId, date: { $gte: thisMonthStart } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $sort: { total: -1 } },
      ]),
    ]);

    const currentSpent = thisMonthExpenses[0]?.total || 0;
    const prevSpent = lastMonthExpenses[0]?.total || 0;
    const currentIncome = thisMonthIncome[0]?.total || 0;
    const transactionCount = thisMonthExpenses[0]?.count || 0;

    const daysElapsedInMonth = now.getDate();
    const dailyAverage = daysElapsedInMonth > 0 ? Math.round(currentSpent / daysElapsedInMonth) : 0;

    let spendingTrendPercentage = 0;
    if (prevSpent > 0) {
      spendingTrendPercentage = Math.round(((currentSpent - prevSpent) / prevSpent) * 100);
    }

    const insights = [];

    if (currentIncome > 0 && currentSpent > currentIncome) {
      insights.push({
        type: 'danger',
        title: 'Spending Exceeds Income',
        message: `You have spent more this month than your total recorded earnings by ${(currentSpent - currentIncome).toLocaleString()}.`,
      });
    } else if (currentIncome > 0 && (currentSpent / currentIncome) > 0.8) {
      insights.push({
        type: 'warning',
        title: 'High Spending Ratio',
        message: `You have utilized ${Math.round((currentSpent / currentIncome) * 100)}% of your monthly income.`,
      });
    } else if (currentIncome > 0) {
      insights.push({
        type: 'success',
        title: 'Healthy Savings Rate',
        message: `You have saved ${Math.round(((currentIncome - currentSpent) / currentIncome) * 100)}% of your income this month.`,
      });
    }

    if (categoryDistribution.length > 0) {
      const topCat = categoryDistribution[0];
      const topCatPercentage = currentSpent > 0 ? Math.round((topCat.total / currentSpent) * 100) : 0;
      insights.push({
        type: 'info',
        title: `Top Spending in ${topCat._id}`,
        message: `${topCat._id} accounts for ${topCatPercentage}% (${topCat.total.toLocaleString()}) of your total expenses this month.`,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        dailyAverage,
        spendingTrendPercentage,
        currentSpent,
        prevSpent,
        currentIncome,
        transactionCount,
        insights,
      },
    });
  } catch (error) {
    next(error);
  }
};
