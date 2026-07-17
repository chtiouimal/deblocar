import { NextResponse } from "next/server";

const TOKEN_PRICES: Record<number, number> = {
  7: 296.21, // TND
  8: 344.89,
  28: 1066.46, // TND
  30: 1145.47, // TND
};

export async function GET() {
  try {
    const response = await fetch("https://api.mbtools.com/map", {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to fetch parameters" },
        { status: response.status },
      );
    }

    const data = await response.json();

    const mapped = data.map((item: any) => ({
      ...item,
      price: TOKEN_PRICES[item.tokenCost] ?? null,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Error fetching parameters:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
