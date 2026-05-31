import { baseApi } from "./baseApi";

export const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL (admin with pagination)
    getServices: builder.query<any, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/admin/services?page=${page}&limit=${limit}`,
      providesTags: ["Services"],
    }),

    // CREATE
    createService: builder.mutation({
      query: (body) => ({
        url: "/admin/services/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Services"],
    }),

    // UPDATE
    updateService: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/services/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Services"],
    }),

    // SOFT DELETE (logical delete)
    deleteService: builder.mutation({
      query: (id: string) => ({
        url: `/admin/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Services"],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = servicesApi;
