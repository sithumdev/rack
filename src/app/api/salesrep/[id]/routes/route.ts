import { getRoutesBySalesRep } from "@/app/_lib/salesrep-routes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const formData = await req.formData();

  const query = String(formData.get("query"));
  const take = String(formData.get("take"));
  const skip = String(formData.get("skip"));
  const salesRepId = Number(context.params.id);

  const { error, routes, total } = await getRoutesBySalesRep(
    query,
    Number(take),
    Number(skip),
    salesRepId
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
