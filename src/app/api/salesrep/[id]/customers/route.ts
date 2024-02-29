import { getCustomersBySalesRep } from "@/app/_lib/salesrep-customer";
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

  const { error, customers, total } = await getCustomersBySalesRep(
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
    customers,
    total,
  });
}