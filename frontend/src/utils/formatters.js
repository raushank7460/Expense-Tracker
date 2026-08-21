export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';

  if (options.short) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  if (options.monthYear) {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getCategoryIconName = (categoryName) => {
  const map = {
    food: 'utensils',
    shopping: 'shopping-bag',
    transportation: 'car',
    transport: 'car',
    bills: 'file-text',
    utilities: 'file-text',
    entertainment: 'film',
    healthcare: 'activity',
    health: 'activity',
    education: 'book-open',
    travel: 'map-pin',
    salary: 'briefcase',
    freelance: 'laptop',
    business: 'trending-up',
    investment: 'dollar-sign',
    other: 'tag',
  };

  const key = (categoryName || '').toLowerCase().trim();
  return map[key] || 'tag';
};

export const getCategoryColor = (categoryName) => {
  const map = {
    food: '#ef4444',
    shopping: '#f59e0b',
    transportation: '#3b82f6',
    bills: '#8b5cf6',
    entertainment: '#ec4899',
    healthcare: '#10b981',
    education: '#06b6d4',
    travel: '#f97316',
    salary: '#10b981',
    freelance: '#6366f1',
    business: '#8b5cf6',
    investment: '#06b6d4',
    other: '#6b7280',
  };

  const key = (categoryName || '').toLowerCase().trim();
  return map[key] || '#6366f1';
};
