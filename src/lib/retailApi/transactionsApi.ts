import { RetailTransaction, RetailTransactionType } from "@/types/retail";
import { retailBaseApi } from "./retailBaseApi";

export const transactionsApi = retailBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<
      {
        transactions: RetailTransaction[];
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
        url: "/retail/tokens/transactions",
        params: {
          page,
          limit,
          ...(type && { type }),
        },
      }),

      providesTags: ["RetailTransactions"],
    }),
  }),
});

export const { useGetTransactionsQuery } = transactionsApi;
