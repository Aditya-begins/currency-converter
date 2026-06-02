import React from 'react';
import { motion } from 'framer-motion';

const RateTable = ({ rates, baseCurrency }) => {
  const popularCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY'];
  
  return (
    <motion.div 
      className="rate-table"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <h2>Current Exchange Rates (Base: {baseCurrency})</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Currency</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {popularCurrencies.map(currency => (
              <motion.tr 
                key={currency}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <td>{currency}</td>
                <td>{rates[currency] ? rates[currency].toFixed(6) : 'N/A'}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default RateTable;