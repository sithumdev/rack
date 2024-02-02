"use client";

import { useState } from "react";
import { BarChartCloud } from ".";
import { ReportMode } from "../_lib/globals";
import { IAnalyticsDemandingProduct } from "./bar-chart";

export default function TopReleases() {
  const [mode, setMode] = useState<ReportMode>(ReportMode.DAILY);
  const [analytics, setAnalytics] = useState<IAnalyticsDemandingProduct[]>([]);

  return (
    <div>
      <h2 className="text-4xl mb-4 text-gray-400">Total Inventory Movements</h2>
      <BarChartCloud
        onModeChange={(mode) => setMode(mode)}
        analytics={analytics}
      />
    </div>
  );
}
