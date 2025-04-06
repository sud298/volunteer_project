import { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";

// Options for the dropdown to select between air and water quality
const qualityOptions = [
  { label: "Air Quality", value: "air" },
  { label: "Water Quality", value: "water" }
];

// Mock data for air quality
const airQualityData = {
  labels: ["10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM"],
  datasets: [
    {
      label: "PM2.5",
      data: [50, 55, 60, 58, 65, 70],
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      fill: true,
    },
    {
      label: "PM10",
      data: [80, 85, 90, 88, 92, 95],
      borderColor: "rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      fill: true,
    },
  ],
};

// Mock data for water quality
const waterQualityData = {
  labels: ["10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM"],
  datasets: [
    {
      label: "pH",
      data: [7.0, 7.1, 7.0, 6.9, 7.2, 7.0],
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      fill: true,
    },
    {
      label: "Temperature (°C)",
      data: [25, 26, 27, 26, 28, 29],
      borderColor: "rgba(255, 206, 86, 1)",
      backgroundColor: "rgba(255, 206, 86, 0.2)",
      fill: true,
    },
    {
      label: "Humidity (%)",
      data: [60, 62, 65, 63, 66, 68],
      borderColor: "rgba(153, 102, 255, 1)",
      backgroundColor: "rgba(153, 102, 255, 0.2)",
      fill: true,
    },
  ],
};

// Default options for the chart
const defaultOptions = {
  responsive: true,
  plugins: {
    tooltip: {
      enabled: true,
      mode: "index" as const,
      intersect: false,
      callbacks: {
        label: (tooltipItem: any) => `${tooltipItem.dataset.label}: ${tooltipItem.raw}`,
      },
    },
    legend: {
      display: true,
      position: "top" as const,
    },
  },
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  scales: {
    x: {
      title: { display: true, text: "Time of Day" },
    },
    y: {
      title: { display: true, text: "Value" },
    },
  },
};

export default function QualityGraph() {
  const [selectedQuality, setSelectedQuality] = useState("air");
  const [chartData, setChartData] = useState<any>({});

  // Update chart data when the selected quality changes
  useEffect(() => {
    if (selectedQuality === "air") {
      setChartData(airQualityData);
    } else if (selectedQuality === "water") {
      setChartData(waterQualityData);
    }
  }, [selectedQuality]);

  return (
    <div className="p-d-flex p-flex-column p-ai-center" style={{ margin: "20px" }}>
      {/* Dropdown to select between Air and Water Quality */}
      <Dropdown
        value={selectedQuality}
        options={qualityOptions}
        onChange={(e) => setSelectedQuality(e.value)}
        placeholder="Select Quality"
        style={{ width: "200px", marginBottom: "20px" }}
      />

      {/* Render the line chart */}
      <div style={{ width: "600px" }}>
        <Chart type="line" data={chartData} options={defaultOptions} />
      </div>
    </div>
  );
}
