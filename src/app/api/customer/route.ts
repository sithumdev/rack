import { getCustomers } from "@/app/_lib/salesrep-customer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const query = String(formData.get("query"));
  const take = String(formData.get("take"));
  const skip = String(formData.get("skip"));

  const { error, customers, total } = await getCustomers(
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
    customers,
    total,
  });
}
