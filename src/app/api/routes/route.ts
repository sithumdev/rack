import { getRoutes } from "@/app/_lib/salesrep-routes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const query = String(formData.get("query"));
  const take = String(formData.get("take"));
  const skip = String(formData.get("skip"));

  const { error, routes, total } = await getRoutes(
    query,
    Number(take),
    Number(skip)
  );

  if (error) {
    return NextResponse.json({
      error,
    });
  }

  return NextResponse.json({
    routes,
    total,
  });
}