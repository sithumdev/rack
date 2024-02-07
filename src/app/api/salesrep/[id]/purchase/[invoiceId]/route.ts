import { getPurchasesInvoiceBySalesRep } from "@/app/_lib/salesrep-purchase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  context: { params: { id: string; invoiceId: string } }
) {
  const salesRepId = Number(context.params.id);
  const invoiceId = Number(context.params.invoiceId);

  const { error, salesRepPurchase } = await getPurchasesInvoiceBySalesRep(
    invoiceId,
    salesRepId
  );

  if (error) {
    return NextResponse.json({
      error,
    });
  }

  return NextResponse.json({
    salesRepPurchase,
  });
}
