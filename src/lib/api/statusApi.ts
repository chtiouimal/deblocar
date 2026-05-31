import { baseApi } from "@/lib/api/baseApi";

export const statusApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL
    getStatuses: builder.query<any[], void>({
      query: () => "/status",
      transformResponse: (res: any) => res.statuses,
      providesTags: ["Status"],
    }),

    // CREATE
    createStatus: builder.mutation({
      query: (body) => ({
        url: "/admin/status/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Status"],
    }),

    // DELETE (soft delete)
    deleteStatus: builder.mutation({
      query: (id) => ({
        url: `/admin/status/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Status"],
    }),
  }),
});

export const {
  useGetStatusesQuery,
  useCreateStatusMutation,
  useDeleteStatusMutation,
} = statusApi;
