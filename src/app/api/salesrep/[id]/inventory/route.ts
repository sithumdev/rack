import { getMobileInventoriesBySalesRep } from "@/app/_lib/mobile-inventory";
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

  const { error, mobileInventories, total } =
    await getMobileInventoriesBySalesRep(
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
    mobileInventories,
    total,
  });
}
