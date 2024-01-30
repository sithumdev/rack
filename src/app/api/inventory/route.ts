import { getInventory } from "@/app/_lib/inventory";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const query = String(formData.get("query"));

  const { error, inventory } = await getInventory(query);

  if (error) {
    return NextResponse.json({
      error,
    });
  }

  return NextResponse.json({
    inventory,
  });
}
