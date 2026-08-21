import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useCurrency } from '../../context/CurrencyContext';

export const IncomeModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) => {
  const { currency } = useCurrency();
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        source: initialData.source || '',
        amount: initialData.amount || '',
        date: initialData.date
          ? new Date(initialData.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        description: initialData.description || '',
      });
    } else {
      setFormData({
        source: 'Salary',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.source.trim()) newErrors.source = 'Income source is required';
    if (!formData.amount || Number(formData.amount) <= 0)
      newErrors.amount = 'Amount must be greater than 0';
    if (!formData.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      amount: Number(formData.amount),
    });
  };

  const commonSources = ['Salary', 'Freelancing', 'Business', 'Investment', 'Dividends', 'Gift', 'Rental', 'Other'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Income Record' : 'Record New Income'}
      subtitle="Log your incoming cash flow and earnings"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Income Source <span className="text-rose-500">*</span>
          </label>
          <div className="space-y-2">
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {commonSources.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
            {formData.source === 'Other' && (
              <Input
                placeholder="Specify income source name..."
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                error={errors.source}
              />
            )}
          </div>
        </div>

        <Input
          label={`Amount (${currency.symbol})`}
          type="number"
          step="0.01"
          placeholder="0.00"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          error={errors.amount}
          required
        />

        <Input
          label="Date Received"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          error={errors.date}
          required
        />

        <div className="flex flex-col space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Description (Optional)
          </label>
          <textarea
            rows="3"
            placeholder="Add any details or reference number..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="success" isLoading={isLoading}>
            {initialData ? 'Update Income' : 'Save Income'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default IncomeModal;
