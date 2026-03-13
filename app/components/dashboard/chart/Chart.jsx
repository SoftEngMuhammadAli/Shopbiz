"use client";

import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import styles from "./chart.module.css";

const data = [
  { name: "Jan", revenue: 4200, orders: 240 },
  { name: "Feb", revenue: 3100, orders: 198 },
  { name: "Mar", revenue: 5100, orders: 320 },
  { name: "Apr", revenue: 2780, orders: 210 },
  { name: "May", revenue: 4890, orders: 410 },
  { name: "Jun", revenue: 6390, orders: 520 },
  { name: "Jul", revenue: 7490, orders: 610 },
  { name: "Aug", revenue: 8200, orders: 690 },
  { name: "Sep", revenue: 6900, orders: 560 },
  { name: "Oct", revenue: 9400, orders: 760 },
  { name: "Nov", revenue: 10500, orders: 820 },
  { name: "Dec", revenue: 12000, orders: 950 },
];

const Chart = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Sales Analytics</h2>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%" minHeight={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="5 5" stroke="var(--border-color)" />

            <XAxis dataKey="name" stroke="var(--text-soft)" />

            <YAxis stroke="var(--text-soft)" />

            <Tooltip
              contentStyle={{
                background: "var(--bg-soft)",
                border: "1px solid var(--border-color)",
              }}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4 }}
            />

            <Line
              type="monotone"
              dataKey="orders"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
