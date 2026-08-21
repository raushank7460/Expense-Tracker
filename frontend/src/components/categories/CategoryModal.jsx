import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import CategoryIcon from '../common/CategoryIcon';

export const CategoryModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: 'tag',
    color: '#6366f1',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        icon: initialData.icon || 'tag',
        color: initialData.color || '#6366f1',
      });
    } else {
      setFormData({
        name: '',
        icon: 'tag',
        color: '#6366f1',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const availableIcons = [
    'utensils',
    'shopping-bag',
    'car',
    'file-text',
    'film',
    'activity',
    'book-open',
    'map-pin',
    'briefcase',
    'laptop',
    'trending-up',
    'heart',
    'home',
    'tag',
  ];

  const presetColors = [
    '#6366f1', // indigo
    '#ef4444', // red
    '#f59e0b', // amber
    '#10b981', // emerald
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#f97316', // orange
    '#6b7280', // slate
  ];

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Category name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Category' : 'Create Custom Category'}
      subtitle="Organize your expenses and budgets with custom categories"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Category Name"
          placeholder="e.g. Fitness, Subscriptions, Pet Care"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          required
        />

        {/* Icon Picker */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Select Icon
          </label>
          <div className="grid grid-cols-7 gap-2 p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
            {availableIcons.map((ic) => (
              <button
                key={ic}
                type="button"
                onClick={() => setFormData({ ...formData, icon: ic })}
                className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
                  formData.icon === ic
                    ? 'bg-brand-600 text-white shadow-sm scale-105'
                    : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <CategoryIcon icon={ic} className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>

        {/* Color Picker */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Select Color Tag
          </label>
          <div className="flex flex-wrap gap-2.5 p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
            {presetColors.map((clr) => (
              <button
                key={clr}
                type="button"
                onClick={() => setFormData({ ...formData, color: clr })}
                style={{ backgroundColor: clr }}
                className={`w-7 h-7 rounded-full transition-transform ${
                  formData.color === clr ? 'ring-2 ring-offset-2 ring-brand-500 scale-110' : 'hover:scale-105'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Preview Badge */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
          <span className="text-slate-500">Live Preview:</span>
          <span
            style={{
              backgroundColor: `${formData.color}20`,
              color: formData.color,
              borderColor: `${formData.color}40`,
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border font-semibold"
          >
            <CategoryIcon icon={formData.icon} className="w-3.5 h-3.5" />
            <span>{formData.name || 'Category Preview'}</span>
          </span>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialData ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryModal;
