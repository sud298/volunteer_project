import { Chart } from "primereact/chart";
import { useState, useEffect } from "react";

const AirQualityLineChart = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    // Mock Air Quality Data (Replace with API Call)
    const labels = ["10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM"];
    const pm25 = [50, 55, 60, 58, 65, 70];
    const pm10 = [80, 85, 90, 88, 92, 95];
    const temperature = [25, 26, 27, 26, 28, 29]; // In °C
    const humidity = [60, 62, 65, 63, 66, 68]; // In %

    const data = {
      labels,
      datasets: [
        {
          label: "PM2.5",
          data: pm25,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
        },
        {
          label: "PM10",
          data: pm10,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: true,
        },
        {
          label: "Temperature (°C)",
          data: temperature,
          borderColor: "rgba(255, 206, 86, 1)",
          backgroundColor: "rgba(255, 206, 86, 0.2)",
          fill: true,
        },
        {
          label: "Humidity (%)",
          data: humidity,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        tooltip: {
          enabled: true,
          mode: "index",
          intersect: false,
          callbacks: {
            label: (tooltipItem: any) => {
              return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
            },
          },
        },
        legend: {
          display: true,
          position: "top",
        },
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Time of Day",
          },
        },
        y: {
          title: {
            display: true,
            text: "Value",
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  return (
    <div className="p-card p-4">
      <h3 className="text-center">Air Quality Over Time</h3>
      <Chart type="line" data={chartData} options={chartOptions} />
    </div>
  );
};

export default AirQualityLineChart;
