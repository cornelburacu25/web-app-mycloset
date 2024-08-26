import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const MostOwnedCategoryChart = ({ userId }) => {
  const [chartData, setChartData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchChartData = async () => {
      const response = await fetch(`http://localhost:9000/mycloset/most-owned-categories/${userId}`);
      const data = await response.json();
      processChartData(data.mostOwnedCategories);
    };

    fetchChartData();
  }, [userId]);

  const processChartData = (data) => {
    const categories = data.map(item => item.category);
    const counts = data.map(item => item.count);

    setChartData({
      labels: categories,
      datasets: [
        {
          label: 'Most Owned Category',
          data: counts,
          backgroundColor: 'rgba(0, 123, 255, 0.2)',
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 1,
        },
      ],
    });
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          font: {
            size: 10
          }
        }
      },
      y: {
        ticks: {
          font: {
            size: 10
          }
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Most Owned Categories',
        font: {
          size: 16
        }
      }
    }
  };

  return (
    <div style={{ width: '95%', height: '300px' }}>
      {chartData ? (
        <Bar ref={chartRef} data={chartData} options={options} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default MostOwnedCategoryChart;
