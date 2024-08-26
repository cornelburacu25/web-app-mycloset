import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import styled from 'styled-components';

const ChartContainer = styled.div`
  width: 100%;
  max-width: 600px;
  height: 400px;

  @media (max-width: 768px) {
    max-width: 400px;
    height: 300px;
  }

  @media (max-width: 500px) {
    max-width: 300px;
    height: 300px;
  }
`;

const MostOwnedColorsChart = ({ userId }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      const response = await fetch(`http://localhost:9000/mycloset/most-owned-colors/${userId}`);
      const data = await response.json();
      processChartData(data.mostOwnedColors);
    };

    fetchChartData();
  }, [userId]);

  const processChartData = (data) => {
    const colors = data.map(item => item.color);
    const counts = data.map(item => item.count);

    const chartColors = {
      blue: '#007bff',
      red: '#ff073a',
      yellow: '#ffc107',
      green: '#28a745',
      pink: '#e83e8c',
      purple: '#6f42c1',
      brown: '#795548',
      white: '#ffffff',
      black: '#343a40',
      cyan: '#17a2b8',
      orange: '#fd7e14',
      gray: '#6c757d'
    };

    const backgroundColors = colors.map(color => chartColors[color.toLowerCase()] || '#000000');

    setChartData({
      labels: colors,
      datasets: [
        {
          data: counts,
          backgroundColor: backgroundColors,
        },
      ],
    });
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Most Owned Colors',
        font: {
          size: 16
        }
      }
    }
  };

  return chartData ? (
    <ChartContainer>
      <Pie data={chartData} options={options} />
    </ChartContainer>
  ) : (
    <div>Loading...</div>
  );
};

export default MostOwnedColorsChart;
