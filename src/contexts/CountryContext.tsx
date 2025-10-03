import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyConverter, CountryCurrency } from '@/utils/CurrencyConverter';

interface CountryContextType {
  selectedCountry: string | null;
  currency: CountryCurrency | null;
  setCountry: (countryCode: string) => void;
  convertPrice: (eurPrice: number) => { amount: number; formatted: string };
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export const CountryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [currency, setCurrency] = useState<CountryCurrency | null>(null);

  useEffect(() => {
    // Auto-detect country on mount
    CurrencyConverter.detectCountry().then(country => {
      if (country && country !== 'DEFAULT') {
        setCountry(country);
      }
    });
  }, []);

  const setCountry = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setCurrency(CurrencyConverter.getCurrencyInfo(countryCode));
  };

  const convertPrice = (eurPrice: number) => {
    if (!selectedCountry) {
      return { amount: eurPrice, formatted: `${eurPrice}€` };
    }
    return CurrencyConverter.convertPrice(eurPrice, selectedCountry);
  };

  return (
    <CountryContext.Provider value={{
      selectedCountry,
      currency,
      setCountry,
      convertPrice
    }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = () => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountry must be used within CountryProvider');
  }
  return context;
};