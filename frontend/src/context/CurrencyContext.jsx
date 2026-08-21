import React, { createContext, useContext, useState, useEffect } from 'react';

const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', locale: 'en-CA' },
  AUD: { code: 'AUD', symbol: 'AU$', name: 'Australian Dollar', locale: 'en-AU' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  CNY: { code: 'CNY', symbol: 'CN¥', name: 'Chinese Yuan', locale: 'zh-CN' },
};

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currencyCode, setCurrencyCode] = useState(() => {
    return localStorage.getItem('spendflow_currency') || 'INR';
  });

  const currency = CURRENCIES[currencyCode] || CURRENCIES.INR;

  const setCurrency = (code) => {
    if (CURRENCIES[code]) {
      setCurrencyCode(code);
      localStorage.setItem('spendflow_currency', code);
    }
  };

  const formatCurrency = (amount, options = {}) => {
    const num = Number(amount) || 0;
    const formattedNum = num.toLocaleString(currency.locale, {
      minimumFractionDigits: options.decimals ?? (num % 1 === 0 ? 0 : 2),
      maximumFractionDigits: 2,
    });
    return `${currency.symbol}${formattedNum}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyCode,
        currencies: CURRENCIES,
        setCurrency,
        formatCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
