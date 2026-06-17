import { baseApi } from "./baseApi";


export const leadsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeads: builder.query({
      query: (params: {
        page?: number;
        limit?: number;
        status?: string;
        city?: string;
        brand?: string;
        score?: string;
        date?: string;
        services?: string[];
      }) => {
        const search = new URLSearchParams();

        if (params.page) search.set("page", String(params.page));
        if (params.limit) search.set("limit", String(params.limit));
        if (params.status) search.set("status", params.status);
        if (params.city) search.set("city", params.city);
        if (params.brand) search.set("brand", params.brand);
        if (params.score) search.set("score", params.score);
        if (params.date) search.set("date", params.date);

        if (params.services?.length) {
          search.set("services", params.services.join(","));
        }

        return `/admin/lead?${search.toString()}`;
      },
      providesTags: ["Leads"],
    }),

    getLeadById: builder.query({
      query: (id: string) => `/admin/lead/${id}`,
      providesTags: ["Leads"],
    }),
    createLead: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/lead`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Leads", "Devis", "Calendar"],
    }),
    createRdv: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/admin/lead/${id}/create-rdv`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Leads", "Devis", "Calendar"],
    }),
  }),
});

export const {
  useGetLeadsQuery,
  useGetLeadByIdQuery,
  useCreateRdvMutation,
  useCreateLeadMutation,
} = leadsApi;
