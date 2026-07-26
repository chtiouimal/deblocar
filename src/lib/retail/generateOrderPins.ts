import RetailOrderItem, {
  RetailOrderItemStatus,
} from "@/models/RetailOrderItem";

export async function generateOrderPins(orderItems: any[]) {
  const apiKey = process.env.MBTOOLS_API_KEY;

  const results = await Promise.all(
    orderItems.map(async (orderItem) => {
      try {
        const params = new URLSearchParams({
          hu: orderItem.hu,

          region: orderItem.region,

          version: orderItem.version,

          vin: orderItem.vin,

          apiKey: apiKey!,
        });

        const response = await fetch(`https://api.mbtools.com/map?${params}`);

        if (!response.ok) {
          throw new Error("Generation failed");
        }

        const data = await response.json();

        await RetailOrderItem.findByIdAndUpdate(orderItem._id, {
          pin: data.pin,

          status: RetailOrderItemStatus.SUCCESS,
        });

        return {
          ...orderItem.toObject(),

          pin: data.pin,
        };
      } catch (error: any) {
        await RetailOrderItem.findByIdAndUpdate(orderItem._id, {
          status: RetailOrderItemStatus.FAILED,

          error: error.message,
        });

        return null;
      }
    }),
  );

  return results;
}
