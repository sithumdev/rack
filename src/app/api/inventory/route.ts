import { getInventory } from "@/app/_lib/inventory";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const query = String(formData.get("query"));
  const take = String(formData.get("take"));
  const skip = String(formData.get("skip"));

  const { error, inventory, total } = await getInventory(
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
    inventory,
    total,
  });
}
