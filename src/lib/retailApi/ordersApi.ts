import { CreateOrderBody, CreateOrderResponse } from "@/types/retail";
import { retailBaseApi } from "./retailBaseApi";

export const ordersApi = retailBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderBody>({
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
    getOrderStatus: builder.query<
      {
        orderStatus: string;
        paymentStatus: string | null;
      },
      string
    >({
      query: (orderId) => `/retail/orders/${orderId}/status`,
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrderStatusQuery } = ordersApi;
