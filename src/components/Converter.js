import React from 'react';
import { motion } from 'framer-motion';
import AnimatedNumber from './AnimatedNumber';

const Converter = ({
  amount,
  baseCurrency,
  targetCurrency,
  convertedAmount,
  rates,
  onAmountChange,
  onBaseCurrencyChange,
  onTargetCurrencyChange,
  onSwap
}) => {
  const currencyOptions = Object.keys(rates).map(currency => (
    <option key={currency} value={currency}>
      {currency}
    </option>
  ));

  return (
    <div className="converter-card">
      <motion.div 
        className="converter-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="input-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={onAmountChange}
            min="0"
            step="0.01"
          />
        </div>

        <div className="currency-selectors">
          <div className="input-group">
            <label htmlFor="baseCurrency">From</label>
            <select
              id="baseCurrency"
              value={baseCurrency}
              onChange={onBaseCurrencyChange}
            >
              {currencyOptions}
            </select>
          </div>

          <motion.button 
            className="swap-button"
            onClick={onSwap}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ⇄
          </motion.button>

          <div className="input-group">
            <label htmlFor="targetCurrency">To</label>
            <select
              id="targetCurrency"
              value={targetCurrency}
              onChange={onTargetCurrencyChange}
            >
              {currencyOptions}
            </select>
          </div>
        </div>

        <div className="result-display pulse">
          <AnimatedNumber value={convertedAmount} decimals={2} />
          <span className="currency-code">{targetCurrency}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Converter;