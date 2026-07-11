import { baseApi } from "./baseApi";

export const retailApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET RETAIL USERS (paginated)
    getRetailUsers: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `/admin/retail?page=${page}&limit=${limit}`,
      providesTags: ["Retail"],
    }),
    // TOPUP
    topupBalance: builder.mutation({
      query: (body) => ({
        url: "/admin/tokens/topups",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Retail"],
    }),
  }),
});

export const { useGetRetailUsersQuery, useTopupBalanceMutation } = retailApi;
