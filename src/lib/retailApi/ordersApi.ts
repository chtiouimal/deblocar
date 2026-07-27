import {
  CreateOrderBody,
  CreateOrderResponse,
  RetailOrder,
} from "@/types/retail";
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
    getOrders: builder.query<
      {
        data: RetailOrder[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      },
      {
        page?: number;
        limit?: number;
        status?: string;
        paymentMethod?: string;
      }
    >({
      query: (params) => ({
        url: "/retail/orders",
        params,
      }),

      providesTags: ["RetailOrders"],
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

export const {
  useCreateOrderMutation,
  useGetOrderStatusQuery,
  useGetOrdersQuery,
} = ordersApi;
