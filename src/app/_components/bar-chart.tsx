"use client";

import BarChart from "@cloudscape-design/components/bar-chart";
import Box from "@cloudscape-design/components/box";
import Button from "@cloudscape-design/components/button";
import { FormControl, Select, Spinner } from "@primer/react";
import { ReportMode } from "../_lib/globals";
import { getReportModeByName } from "../_lib/utilities";

export type IAnalyticsDemandingProduct = {
  product: string;
  count: number;
  mrp: number;
};

export type IBarChartCloud = {
  onModeChange: (mode: ReportMode) => void;
  analytics: IAnalyticsDemandingProduct[];
};

export default function BarChartCloud({
  analytics,
  onModeChange,
}: IBarChartCloud) {
  if (typeof window !== "undefined") {
    return (
      <div>
        {analytics.length > 0 ? (
          <>
            <FormControl>
              <FormControl.Label>Product</FormControl.Label>
              <Select
                onChange={(e) => {
                  onModeChange(getReportModeByName(e.target.value));
                }}
              >
                {Object.keys(ReportMode).map((mode) => (
                  <Select.Option key={mode} value={mode.toString()}>
                    {mode}
                  </Select.Option>
                ))}
              </Select>
            </FormControl>
            <BarChart
              series={[
                {
                  title: "Product",
                  type: "bar",
                  data: analytics.map((report) => ({
                    x: `${report.product} - ${report.mrp}`,
                    y: report.count,
                  })),
                },
              ]}
              ariaLabel="Single data series line chart"
              height={300}
              xTitle="Time (UTC)"
              yTitle="Top Moving Product"
              empty={
                <Box textAlign="center" color="inherit">
                  <b>No data available</b>
                  <Box variant="p" color="inherit">
                    There is no data available
                  </Box>
                </Box>
              }
              noMatch={
                <Box textAlign="center" color="inherit">
                  <b>No matching data</b>
                  <Box variant="p" color="inherit">
                    There is no matching data to display
                  </Box>
                  <Button>Clear filter</Button>
                </Box>
              }
            />
          </>
        ) : (
          <p className="text-xs">No Data Found</p>
        )}
      </div>
    );
  }

  return <Spinner />;
}
