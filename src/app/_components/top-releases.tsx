"use client";

import { useEffect, useState } from "react";
import { BarChartCloud } from ".";
import { ReportMode } from "../_lib/globals";
import { IAnalyticsDemandingProduct } from "./bar-chart";

export default function TopReleases() {
  const [mode, setMode] = useState<ReportMode>(ReportMode.DAILY);
  const [analytics, setAnalytics] = useState<IAnalyticsDemandingProduct[]>([]);

  useEffect(() => {
    (async () => {
      const formData = new FormData();

      formData.append("mode", mode);

      const response = await fetch("/api/analytics/release", {
        method: "POST",
        body: formData,
      });

      if (response.status === 200) {
        const data = await response.json();

        if (data && Object.hasOwn(data, "reporting")) {
          console.log(data.reporting);
        }
      }
    })();
  }, [mode]);

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
