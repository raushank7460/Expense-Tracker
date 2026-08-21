import Category from '../models/Category.js';
import Expense from '../models/Expense.js';
import Budget from '../models/Budget.js';

// @desc    Get all categories for the logged-in user
// @route   GET /api/categories
// @access  Private
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ user: req.user._id }).sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new custom category
// @route   POST /api/categories
// @access  Private
export const createCategory = async (req, res, next) => {
  try {
    const { name, icon, color } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a category name',
      });
    }

    const existingCategory = await Category.findOne({
      user: req.user._id,
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name already exists',
      });
    }

    const category = await Category.create({
      user: req.user._id,
      name: name.trim(),
      icon: icon || 'tag',
      color: color || '#6366f1',
      isDefault: false,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = async (req, res, next) => {
  try {
    const { name, icon, color } = req.body;

    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found or unauthorized',
      });
    }

    const oldName = category.name;

    if (name && name.trim() !== oldName) {
      // Check if new name already exists
      const duplicate = await Category.findOne({
        user: req.user._id,
        _id: { $ne: category._id },
        name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
      });

      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: 'Another category with this name already exists',
        });
      }

      category.name = name.trim();

      // Cascade update to expenses and budgets that used the old name
      await Expense.updateMany(
        { user: req.user._id, category: oldName },
        { category: name.trim() }
      );
      await Budget.updateMany(
        { user: req.user._id, category: oldName },
        { category: name.trim() }
      );
    }

    if (icon !== undefined) category.icon = icon;
    if (color !== undefined) category.color = color;

    const updatedCategory = await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found or unauthorized',
      });
    }

    // Check if category is currently used in expenses or budgets
    const [expenseCount, budgetCount] = await Promise.all([
      Expense.countDocuments({ user: req.user._id, category: category.name }),
      Budget.countDocuments({ user: req.user._id, category: category.name }),
    ]);

    if (expenseCount > 0 || budgetCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete '${category.name}' category because it is currently linked to ${expenseCount} expense(s) and ${budgetCount} budget(s). Please reassign or remove those records first.`,
      });
    }

    await Category.findByIdAndDelete(category._id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
