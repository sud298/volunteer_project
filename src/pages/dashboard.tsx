import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Calendar } from "primereact/calendar";
import { Slider } from "primereact/slider";
import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Tag } from "primereact/tag";
import { MultiSelect } from "primereact/multiselect";
import { TabMenu } from "primereact/tabmenu";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const CorpusChristiMap = dynamic(
  () => import("../components/CorpusChristiMap"),
  { ssr: false, loading: () => <p>Loading map...</p> }
);

interface SeriesData {
  name: string;
  type: string;
  data: [number, number][];
  symbol: string;
  color: string;
}

type LocationMappings = {
  "Ingleside (Air)": string;
  "IOB Sandpiper (Air)": string;
  "IOB Sunset (Air)": string;
};

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<Date[] | null>(null);
  const [selectedHour, setSelectedHour] = useState<number>(12);
  const [selectedSites, setSelectedSites] = useState<string[]>([]);
  const echartsRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // All available sites with disabled status
  const allSites = [
    { label: "Ingleside (Air)", value: "Ingleside (Air)", disabled: false },
    { label: "IOB Sandpiper (Air)", value: "IOB Sandpiper (Air)", disabled: false },
    { label: "IOB Sunset (Air)", value: "IOB Sunset (Air)", disabled: false },
    { label: "Gregory (Air)", value: "Gregory (Air)", disabled: true },
    { label: "Hillcrest (Air)", value: "Hillcrest (Air)", disabled: true },
    { label: "NorthExxon-Sabic (Air)", value: "NorthExxon-Sabic (Air)", disabled: true },
    { label: "SouthExxon-Sabic (Air)", value: "SouthExxon-Sabic (Air)", disabled: true },
    { label: "Port Aransas (Air)", value: "Port Aransas (Air)", disabled: true },
    { label: "Ingleside (Water)", value: "Ingleside (Water)", disabled: true }
  ];
  

  // Fetch data from the API based on active tab
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Define location mappings inside the effect to avoid dependency warning
        const locationMappings: LocationMappings = {
          "Ingleside (Air)": "G-TH",
          "IOB Sandpiper (Air)": "IOB-Air-Gen4-12062024",
          "IOB Sunset (Air)": "H-TH"
        };
        
        // Map selected UI names to internal API names
        // Safely map selected UI names to internal API names
        const mappedSites = selectedSites.map(site => {
          if (site in locationMappings) {
            return locationMappings[site as keyof LocationMappings];
          }
          return site; // fallback to original if not found
        });
        
        const params = new URLSearchParams({
          start: dateRange?.[0]?.toISOString() || "",
          end: dateRange?.[1]?.toISOString() || "",
          site: mappedSites.join(","),
          hour: selectedHour.toString(),
        });

        const endpoint = activeIndex === 0 ? "airquality" : "waterquality";
        const response = await fetch(`/api/${endpoint}?${params}`);
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [dateRange, selectedSites, selectedHour, activeIndex]);

  // Map data for the air quality chart
  const getAirQualitySeriesData = (): SeriesData[] => {
    return [
      {
        name: "PM2.5",
        type: "line",
        data: data.map((item) => [
          new Date(item.timestamp || item.receivedtime).getTime(),
          item.pm2_5 || 0,
        ]),
        symbol: "none",
        color: "#4BC0C0",
      },
      {
        name: "PM10",
        type: "line",
        data: data.map((item) => [
          new Date(item.timestamp || item.receivedtime).getTime(),
          item.pm10 || 0,
        ]),
        symbol: "none",
        color: "#9966FF",
      },
      {
        name: "Temperature (°C)",
        type: "line",
        data: data.map((item) => [
          new Date(item.timestamp || item.receivedtime).getTime(),
          item.temperature || 0,
        ]),
        symbol: "none",
        color: "#FFA040",
      },
      {
        name: "Humidity (%)",
        type: "line",
        data: data.map((item) => [
          new Date(item.timestamp || item.receivedtime).getTime(),
          item.humidity || 0,
        ]),
        symbol: "none",
        color: "#FF6384",
      },
    ];
  };

  // Map data for the water quality chart
  const getWaterQualitySeriesData = (): SeriesData[] => {
    return [
      {
        name: "Conductivity",
        type: "line",
        data: data.map((item) => [
          new Date(item.timestamp || item.receivedtime).getTime(),
          item.cond || 0,
        ]),
        symbol: "none",
        color: "#4BC0C0",
      },
      {
        name: "Dissolved Oxygen",
        type: "line",
        data: data.map((item) => [
          new Date(item.timestamp || item.receivedtime).getTime(),
          item.odo || 0,
        ]),
        symbol: "none",
        color: "#9966FF",
      },
      {
        name: "Salinity",
        type: "line",
        data: data.map((item) => [
          new Date(item.timestamp || item.receivedtime).getTime(),
          item.sal || 0,
        ]),
        symbol: "none",
        color: "#FFA040",
      },
      {
        name: "Temperature (°C)",
        type: "line",
        data: data.map((item) => [
          new Date(item.timestamp || item.receivedtime).getTime(),
          item.temp || 0,
        ]),
        symbol: "none",
        color: "#FF6384",
      },
    ];
  };

  // Air quality chart options
  const airQualityChartOptions = {
    title: {
      text: `Air Quality Data - ${selectedSites.join(", ")}`,
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      formatter: (params: any[]) => {
        const date = new Date(params[0].value[0]);
        return `
          ${date.toLocaleString()}<br/>
          ${params
            .map(
              (p) => `
            ${p.marker} ${p.seriesName}: ${p.value[1]}
          `
            )
            .join("<br/>")}
        `;
      },
    },
    legend: {
      data: getAirQualitySeriesData().map((s) => s.name),
      bottom: 10,
      type: "scroll",
    },
    xAxis: {
      type: "time",
      minInterval: 3600 * 1000 * 24,
      axisLabel: {
        formatter: (value: number) => {
          return echarts.time.format(value, "{MM}/{dd} {HH}:{mm}", false);
        },
      },
    },
    yAxis: {
      type: "value",
      scale: true,
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
        zoomLock: false,
      },
      {
        type: "slider",
        start: 0,
        end: 100,
        height: 20,
        bottom: 40,
      },
    ],
    series: getAirQualitySeriesData(),
    grid: {
      top: 80,
      bottom: 120,
      left: 60,
      right: 20,
    },
    animation: false,
    large: true,
  };

  // Water quality chart options
  const waterQualityChartOptions = {
    title: {
      text: `Water Quality Data - ${selectedSites.join(", ")}`,
      left: "center",
    },
    tooltip: {
      trigger: "axis",
      formatter: (params: any[]) => {
        const date = new Date(params[0].value[0]);
        return `
          ${date.toLocaleString()}<br/>
          ${params
            .map(
              (p) => `
            ${p.marker} ${p.seriesName}: ${p.value[1]}
          `
            )
            .join("<br/>")}
        `;
      },
    },
    legend: {
      data: getWaterQualitySeriesData().map((s) => s.name),
      bottom: 10,
      type: "scroll",
    },
    xAxis: {
      type: "time",
      minInterval: 3600 * 1000 * 24,
      axisLabel: {
        formatter: (value: number) => {
          return echarts.time.format(value, "{MM}/{dd} {HH}:{mm}", false);
        },
      },
    },
    yAxis: {
      type: "value",
      scale: true,
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
        zoomLock: false,
      },
      {
        type: "slider",
        start: 0,
        end: 100,
        height: 20,
        bottom: 40,
      },
    ],
    series: getWaterQualitySeriesData(),
    grid: {
      top: 80,
      bottom: 120,
      left: 60,
      right: 20,
    },
    animation: false,
    large: true,
  };

  // Handle chart click
  const handleChartClick = (params: any) => {
    if (params.dataIndex !== undefined) {
      const chart = echartsRef.current?.getEchartsInstance();
      const clickedTime = params.value[0];
      const range = 6 * 3600 * 1000;

      chart.dispatchAction({
        type: "dataZoom",
        startValue: clickedTime - range,
        endValue: clickedTime + range,
      });
    }
  };

  // Reset zoom
  const handleResetZoom = () => {
    const chart = echartsRef.current?.getEchartsInstance();
    chart.dispatchAction({
      type: "dataZoom",
      start: 0,
      end: 100,
    });
  };

  // Left toolbar template
  const leftToolbarTemplate = () => (
    <div className="flex flex-wrap gap-2">
      <div className="flex flex-column gap-2">
        <Calendar
          value={dateRange}
          onChange={(e) => setDateRange(e.value as Date[])}
          selectionMode="range"
          readOnlyInput
          showIcon
          dateFormat="yy-mm-dd"
          placeholder="Select Date Range"
        />
      </div>
      <div className="flex flex-column gap-1">
        <label>24-Hour Slider</label>
        <Slider
          value={selectedHour}
          onChange={(e) => setSelectedHour(e.value as number)}
          min={0}
          max={23}
          className="w-12rem"
        />
      </div>
    </div>
  );

  // Right toolbar template
  const rightToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        label="Reset Zoom"
        icon="pi pi-search-minus"
        onClick={handleResetZoom}
        className="p-button-help"
      />
    </div>
  );

  // Tab menu items
  const items = [
    { label: "Air Quality", icon: "pi pi-cloud" },
    { label: "Water Quality", icon: "pi pi-water" },
  ];

  // Handle tab change
  const handleTabChange = (e: { index: number }) => {
    setActiveIndex(e.index);
  };

  // Show loading spinner if data is being fetched
  if (loading)
    return (
      <div className="flex justify-content-center align-items-center min-h-screen">
        <ProgressSpinner />
      </div>
    );

  return (
    <div className="main-container">
      <div className="p-3 surface-0 border-bottom-1 surface-border">
        <h1 className="text-3xl font-bold text-900 m-0">
          Environmental Monitoring Dashboard
        </h1>
      </div>

      <div className="flex">
        <div className="w-3 p-3 border-right-1 surface-border">
          <Panel header="Location Selection" className="h-full">
            <MultiSelect
              value={selectedSites}
              options={allSites}
              onChange={(e) => setSelectedSites(e.value)}
              placeholder="Select Sites"
              display="chip"
              className="w-full"
              optionDisabled="disabled"
            />
            <div className="mt-3">
              <h4>Environmental Parameters</h4>
              <div
                className="parameter-container"
                style={{ maxHeight: "500px", overflowY: "auto" }}
              >
                {[...airQualityParameters, ...waterQualityParameters].map(
                  (param, index) => (
                    <Card
                      key={`param-${index}`}
                      className="border-1 surface-border"
                      style={{ backgroundColor: `${param.color}10` }}
                    >
                      <div className="flex align-items-center gap-3">
                        <i
                          className={`${param.icon} text-3xl`}
                          style={{ color: param.color }}
                        />
                        <div className="flex flex-column">
                          <h4 className="m-0">{param.title}</h4>
                          <Tag
                            value={param.safeLevel}
                            severity={
                              param.status === "good" ? "success" : "warning"
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm m-0">{param.description}</p>
                        <ul className="mt-2 pl-3">
                          {param.effects.map((effect, idx) => (
                            <li key={idx} className="text-sm">
                              {effect}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  )
                )}
              </div>
            </div>
          </Panel>
        </div>

        <div className="w-9 p-3">
          <TabMenu
            model={items}
            activeIndex={activeIndex}
            onTabChange={handleTabChange}
          />
          <Card className="mt-3">
            <Toolbar
              left={leftToolbarTemplate}
              right={rightToolbarTemplate}
              className="mb-4"
            />
            <div className="flex flex-column gap-3">
              <div className="flex align-items-center gap-2">
                <i className="pi pi-clock" />
                <span>Selected Hour: {selectedHour}:00</span>
              </div>
              <div style={{ height: "400px" }}>
                {activeIndex === 0 ? (
                  <ReactECharts
                    ref={echartsRef}
                    option={airQualityChartOptions}
                    style={{ height: "100%" }}
                    onEvents={{
                      click: handleChartClick,
                    }}
                  />
                ) : (
                  <ReactECharts
                    ref={echartsRef}
                    option={waterQualityChartOptions}
                    style={{ height: "100%" }}
                    onEvents={{
                      click: handleChartClick,
                    }}
                  />
                )}
              </div>
            </div>
          </Card>
          <div className="mt-3" style={{ height: "500px" }}>
            <CorpusChristiMap />
          </div>
        </div>
      </div>
    </div>
  );
}

// Air quality parameters
const airQualityParameters = [
  {
    id: 1,
    title: "PM2.5",
    icon: "pi pi-cloud",
    description:
      "Fine particulate matter smaller than 2.5 micrometers. Can penetrate deep into lungs and bloodstream.",
    effects: [
      "Causes respiratory issues",
      "Linked to heart disease",
      "Reduces visibility",
    ],
    safeLevel: "0-12 µg/m³ (Good)",
    status: "moderate",
    color: "#4BC0C0",
  },
  {
    id: 2,
    title: "PM10",
    icon: "pi pi-circle-off",
    description:
      "Coarse particles smaller than 10 micrometers. Can irritate eyes, nose, and throat.",
    effects: [
      "Aggravates asthma",
      "Coughing difficulty",
      "Short-term breathing issues",
    ],
    safeLevel: "0-54 µg/m³ (Good)",
    status: "good",
    color: "#9966FF",
  },
  {
    id: 3,
    title: "Temperature",
    icon: "pi pi-sun",
    description: "Extreme temperatures affect air quality and comfort.",
    effects: [
      "Heat increases ozone",
      "Cold traps pollutants",
      "Affects equipment readings",
    ],
    safeLevel: "18-24°C (Ideal)",
    status: "moderate",
    color: "#FFA040",
  },
  {
    id: 4,
    title: "Humidity",
    icon: "pi pi-water",
    description: "Moisture level in air affecting particulate behavior.",
    effects: ["High: Mold growth", "Low: Dry airways", "Ideal: 30-50% RH"],
    safeLevel: "30-60% (Comfortable)",
    status: "good",
    color: "#FF6384",
  },
];

// Water quality parameters
const waterQualityParameters = [
  {
    id: 1,
    title: "Conductivity",
    icon: "pi pi-bolt",
    description: "Electrical conductivity of water, indicates dissolved ions",
    effects: [
      "Affects aquatic life",
      "Indicates pollution",
      "Affects water taste",
    ],
    safeLevel: "200-800 µS/cm",
    status: "moderate",
    color: "#4BC0C0",
  },
  {
    id: 2,
    title: "Dissolved Oxygen",
    icon: "pi pi-bubble",
    description: "Oxygen available for aquatic organisms",
    effects: [
      "Essential for fish",
      "Affects decomposition",
      "Indicates water health",
    ],
    safeLevel: ">5 mg/L",
    status: "good",
    color: "#9966FF",
  },
  {
    id: 3,
    title: "Turbidity",
    icon: "pi pi-cloud",
    description: "Water clarity measurement",
    effects: [
      "Affects light penetration",
      "Impacts plant growth",
      "Indicates runoff",
    ],
    safeLevel: "<5 NTU",
    status: "moderate",
    color: "#FFA040",
  },
  {
    id: 4,
    title: "Salinity",
    icon: "pi pi-globe",
    description: "Salt concentration in water",
    effects: [
      "Affects buoyancy",
      "Impacts marine life",
      "Indicates seawater intrusion",
    ],
    safeLevel: "0.5-35 ppt",
    status: "good",
    color: "#FF6384",
  },
];