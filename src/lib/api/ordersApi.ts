import { baseApi } from "./baseApi";

import { RetailOrder, RetailOrderStatus } from "@/types/retail";

export interface GetAdminRetailOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: RetailOrderStatus;
}

export interface GetAdminRetailOrdersResponse {
  data: RetailOrder[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<
      GetAdminRetailOrdersResponse,
      GetAdminRetailOrdersParams
    >({
      query: ({ page = 1, limit = 10, search, status }) => ({
        url: "/admin/retail/orders",
        params: {
          page,
          limit,
          ...(search ? { search } : {}),
          ...(status ? { status } : {}),
        },
      }),

      providesTags: ["RetailOrders"],
    }),
  }),
});

export const { useGetOrdersQuery } = ordersApi;
