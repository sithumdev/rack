import { getPurchasesBySalesRep } from "@/app/_lib/salesrep-purchase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const formData = await req.formData();

  const take = String(formData.get("take"));
  const skip = String(formData.get("skip"));
  const salesRepId = Number(context.params.id);

  const { error, salesRepPurchases, total } = await getPurchasesBySalesRep(
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
    salesRepPurchases,
    total,
  });
}
