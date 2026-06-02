import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnimatedNumber = ({ value, decimals = 2 }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisplayValue(value);
    }, 100);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <motion.span
      key={displayValue}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {displayValue.toFixed(decimals)}
    </motion.span>
  );
};

export default AnimatedNumber;