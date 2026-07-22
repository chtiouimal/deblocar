import { RetailTransactionAdmin, RetailTransactionType } from "@/types/retail";
import { baseApi } from "./baseApi";

export const retailHistoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRetailHistory: builder.query<
      {
        transactions: RetailTransactionAdmin[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
        totalConsumed: number;
        totalTopups: number;
      },
      {
        page?: number;
        limit?: number;
        type?: RetailTransactionType;
      }
    >({
      query: ({ page = 1, limit = 10, type }) => ({
        url: "/admin/retail/history",
        params: {
          page,
          limit,
          ...(type && { type }),
        },
      }),

      providesTags: ["RetailTransactions"],
    }),
    getRetailHistoryById: builder.query<
      {
        transaction: RetailTransactionAdmin;
      },
      string
    >({
      query: (id) => ({
        url: `/admin/retail/history/${id}`,
      }),

      providesTags: (_result, _error, id) => [
        {
          type: "RetailTransactions",
          id,
        },
      ],
    }),
  }),
});

export const { useGetRetailHistoryQuery, useGetRetailHistoryByIdQuery } =
  retailHistoryApi;
