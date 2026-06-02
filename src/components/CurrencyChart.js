import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CurrencyChart = ({ historicalData, baseCurrency, targetCurrency }) => {
  const chartData = {
    labels: historicalData.map(data => data.date),
    datasets: [
      {
        label: `${baseCurrency} to ${targetCurrency}`,
        data: historicalData.map(data => data.rate),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `1 ${baseCurrency} = ${context.parsed.y.toFixed(4)} ${targetCurrency}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: `Rate (${targetCurrency})`,
        },
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
    },
  };

  return (
    <motion.div 
      className="chart-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <h2>Exchange Rate History (Last 30 Days)</h2>
      <div className="chart-wrapper">
        <Line data={chartData} options={options} />
      </div>
    </motion.div>
  );
};

export default CurrencyChart;