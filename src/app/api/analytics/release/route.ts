import { ReportMode } from "@/app/_lib/globals";
import { getProductAnalyticsByWhom } from "@/app/_lib/product-reporting";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const mode = String(formData.get("mode")) as ReportMode;

  const { reporting, error } = await getProductAnalyticsByWhom(mode);

  if (error) {
    return NextResponse.json({
      error,
    });
  }

  return NextResponse.json({
    reporting: reporting?.map((report) => ({
      whom: report.whom,
      count: report._sum.count,
    })),
  });
}
