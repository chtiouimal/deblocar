import { retailBaseApi } from "./retailBaseApi";

export interface CreateOrderItem {
  hu: string;
  region: string;
  version: string;
  vin: string;
}

export const ordersApi = retailBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<
      {
        message: string;
        orderId: string;
        balance: number;
      },
      {
        items: CreateOrderItem[];
      }
    >({
      query: (body) => ({
        url: "/retail/orders",
        method: "POST",
        body,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          dispatch(
            retailBaseApi.util.invalidateTags([
              "RetailTransactions",
              "RetailUser",
            ]),
          );
        } catch {}
      },
    }),
  }),
});

export const { useCreateOrderMutation } = ordersApi;
