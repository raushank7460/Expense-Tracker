export const exportToCSV = (data, filename = 'spendflow_transactions.csv') => {
  if (!data || !data.length) {
    alert('No transactions available to export.');
    return;
  }

  // Headers
  const headers = ['ID', 'Type', 'Title / Source', 'Category', 'Amount', 'Date', 'Payment Method', 'Description'];

  // Rows
  const rows = data.map((item) => [
    `"${item._id || item.id || ''}"`,
    `"${item.type || 'Expense'}"`,
    `"${(item.title || item.source || '').replace(/"/g, '""')}"`,
    `"${(item.category || '').replace(/"/g, '""')}"`,
    item.amount,
    `"${item.date ? new Date(item.date).toISOString().split('T')[0] : ''}"`,
    `"${(item.paymentMethod || 'N/A').replace(/"/g, '""')}"`,
    `"${(item.description || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const printFinancialReport = () => {
  window.print();
};
