import Income from '../models/Income.js';

// @desc    Create a new income record
// @route   POST /api/income
// @access  Private
export const createIncome = async (req, res, next) => {
  try {
    const { source, amount, date, description } = req.body;

    if (!source || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide source and amount',
      });
    }

    const income = await Income.create({
      user: req.user._id,
      source: source.trim(),
      amount: Number(amount),
      date: date ? new Date(date) : new Date(),
      description: description ? description.trim() : '',
    });

    res.status(201).json({
      success: true,
      message: 'Income record created successfully',
      data: income,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all user income records with search, filter, sorting & pagination
// @route   GET /api/income
// @access  Private
export const getIncomes = async (req, res, next) => {
  try {
    const {
      search,
      source,
      startDate,
      endDate,
      sortBy = 'date_desc',
      page = 1,
      limit = 10,
    } = req.query;

    const query = { user: req.user._id };

    // Search by source or description
    if (search && search.trim() !== '') {
      query.$or = [
        { source: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Filter by source
    if (source && source !== 'All') {
      query.source = source;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Sorting
    let sortOptions = { date: -1 };
    if (sortBy === 'date_asc') sortOptions = { date: 1 };
    if (sortBy === 'date_desc') sortOptions = { date: -1 };
    if (sortBy === 'amount_asc') sortOptions = { amount: 1 };
    if (sortBy === 'amount_desc') sortOptions = { amount: -1 };

    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const total = await Income.countDocuments(query);
    const incomes = await Income.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    // Calculate total income amount matching this filter query
    const totalAmountAggregate = await Income.aggregate([
      { $match: query },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
    ]);
    const filteredTotalAmount = totalAmountAggregate[0]?.totalAmount || 0;

    res.status(200).json({
      success: true,
      data: incomes,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize) || 1,
        limit: pageSize,
      },
      summary: {
        totalAmount: filteredTotalAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single income record by ID
// @route   GET /api/income/:id
// @access  Private
export const getIncomeById = async (req, res, next) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income record not found or unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      data: income,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an income record
// @route   PUT /api/income/:id
// @access  Private
export const updateIncome = async (req, res, next) => {
  try {
    const { source, amount, date, description } = req.body;

    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income record not found or unauthorized',
      });
    }

    if (source !== undefined) income.source = source.trim();
    if (amount !== undefined) income.amount = Number(amount);
    if (date !== undefined) income.date = new Date(date);
    if (description !== undefined) income.description = description.trim();

    const updatedIncome = await income.save();

    res.status(200).json({
      success: true,
      message: 'Income record updated successfully',
      data: updatedIncome,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an income record
// @route   DELETE /api/income/:id
// @access  Private
export const deleteIncome = async (req, res, next) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: 'Income record not found or unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Income record deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
