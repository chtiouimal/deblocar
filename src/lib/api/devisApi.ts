import { baseApi } from "@/lib/api/baseApi";

export const devisApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDevis: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) =>
        `/admin/devis?page=${page}&limit=${limit}`,
      providesTags: ["Devis"],
    }),

    getDevisById: builder.query<any, string>({
      query: (id) => `/admin/devis/${id}`,
      providesTags: ["Devis"],
    }),
  }),
});

export const { useGetDevisQuery, useGetDevisByIdQuery } = devisApi;
