import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Converter from './components/Converter';
import RateTable from './components/RateTable';
import CurrencyChart from './components/CurrencyChart';
import './App.css';
import './styles/animations.css';
import './styles/main.css';

const generateMockRates = (baseCurrency) => {
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY'];
  const rates = {};
  currencies.forEach(currency => {
    rates[currency] = currency === baseCurrency ? 1 : (0.5 + Math.random() * 2).toFixed(6);
  });
  return rates;
}; 

const generateMockHistory = (baseCurrency, targetCurrency) => {
  const history = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    history.push({
      date: date.toISOString().split('T')[0],
      rate: (0.7 + Math.random() * 0.6).toFixed(6) // Random rate between 0.7-1.3
    });
  }
  
  return history;
};

function App() {
  const [rates, setRates] = useState({});
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  // Fetch latest rates with retry logic
  const fetchRates = async (retryCount = 0) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
      );
      
      if (!response.data?.rates) {
        throw new Error('Invalid API response');
      }
      
      setRates(response.data.rates);
      setConvertedAmount(amount * response.data.rates[targetCurrency]);
      setUsingMockData(false);
    } catch (err) {
      if (retryCount < 2) {
        // Retry after 1 second
        setTimeout(() => fetchRates(retryCount + 1), 1000);
      } else {
        console.error("Using mock data for rates due to API error:", err);
        const mockRates = generateMockRates(baseCurrency);
        setRates(mockRates);
        setConvertedAmount(amount * mockRates[targetCurrency]);
        setUsingMockData(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch historical data with fallback
  const fetchHistoricalData = async () => {
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      const startDateStr = startDate.toISOString().split('T')[0];

      const response = await axios.get(
        `https://api.exchangerate.host/timeseries?start_date=${startDateStr}&end_date=${endDate}&base=${baseCurrency}&symbols=${targetCurrency}`
      );
      
      if (!response.data?.rates) {
        throw new Error('Invalid historical data response');
      }
      
      const chartData = Object.entries(response.data.rates)
        .map(([date, rates]) => ({
          date,
          rate: rates[targetCurrency]
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setHistoricalData(chartData);
    } catch (err) {
      console.error("Using mock historical data due to API error:", err);
      setHistoricalData(generateMockHistory(baseCurrency, targetCurrency));
    }
  };

  // Effect for rates
  useEffect(() => {
    fetchRates();
  }, [baseCurrency]);

  // Effect for conversion
  useEffect(() => {
    if (rates[targetCurrency]) {
      setConvertedAmount(amount * rates[targetCurrency]);
    }
  }, [amount, targetCurrency, rates]);

  // Effect for historical data
  useEffect(() => {
    fetchHistoricalData();
  }, [baseCurrency, targetCurrency]);

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setAmount(value);
    }
  };

  const handleBaseCurrencyChange = (e) => {
    setBaseCurrency(e.target.value);
  };

  const handleTargetCurrencyChange = (e) => {
    setTargetCurrency(e.target.value);
  };

  const swapCurrencies = () => {
    setBaseCurrency(targetCurrency);
    setTargetCurrency(baseCurrency);
  };

  if (loading && !usingMockData) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading exchange rates...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header slide-in">
        <h1>Currency Converter</h1>
        <p className="subtitle">Real-time exchange rates with historical trends</p>
        {usingMockData && (
          <div className="mock-data-warning">
            Note: Using mock data as API is unavailable
          </div>
        )}
      </header>

      <main className="main-content">
        <div className="converter-section">
          <Converter 
            amount={amount}
            baseCurrency={baseCurrency}
            targetCurrency={targetCurrency}
            convertedAmount={convertedAmount}
            rates={rates}
            onAmountChange={handleAmountChange}
            onBaseCurrencyChange={handleBaseCurrencyChange}
            onTargetCurrencyChange={handleTargetCurrencyChange}
            onSwap={swapCurrencies}
          />
        </div>

        <div className="chart-section fade-in">
          <CurrencyChart 
            historicalData={historicalData} 
            baseCurrency={baseCurrency}
            targetCurrency={targetCurrency}
            usingMockData={usingMockData}
          />
        </div>

        <div className="rates-section slide-up">
          <RateTable 
            rates={rates} 
            baseCurrency={baseCurrency} 
            usingMockData={usingMockData}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>
          {usingMockData 
            ? "Currently using simulated data as the API is unavailable"
            : "Exchange rates updated in real-time. Data provided by ExchangeRate-API."}
        </p>
      </footer>
    </div>
  );
}

export default App;