import { ReportMode } from "@/app/_lib/globals";
import { getProductAnalytics } from "@/app/_lib/product-reporting";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const mode = String(formData.get("mode")) as ReportMode;

  const { demandingProducts, error } = await getProductAnalytics(mode);

  if (error) {
    return NextResponse.json({
      error,
    });
  }

  return NextResponse.json({
    demandingProducts,
  });
}
