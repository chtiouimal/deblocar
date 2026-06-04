import { baseApi } from "./baseApi";

interface DashboardParams {
  filter?: "day" | "month" | "year";
  day?: number;
  month?: number;
  year?: number;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<any, DashboardParams>({
      query: ({ filter = "month", day, month, year } = {}) => {
        const params = new URLSearchParams({ filter });
        if (day) params.set("day", String(day));
        if (month) params.set("month", String(month));
        if (year) params.set("year", String(year));
        return `/admin/dashboard?${params.toString()}`;
      },
      providesTags: ["Dashboard"],
    }),

    getLeadsRdvsChart: builder.query<any, DashboardParams>({
      query: ({ filter = "month", day, month, year } = {}) => {
        const params = new URLSearchParams({ filter });
        if (day) params.set("day", String(day));
        if (month) params.set("month", String(month));
        if (year) params.set("year", String(year));
        return `/admin/dashboard/charts/leads-rdvs?${params.toString()}`;
      },
      providesTags: ["Dashboard"],
    }),

    getServicesChart: builder.query<any, DashboardParams>({
      query: ({ filter = "month", day, month, year } = {}) => {
        const params = new URLSearchParams({ filter });
        if (day) params.set("day", String(day));
        if (month) params.set("month", String(month));
        if (year) params.set("year", String(year));
        return `/admin/dashboard/charts/services?${params.toString()}`;
      },
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetDashboardQuery,
  useGetLeadsRdvsChartQuery,
  useGetServicesChartQuery,
} = dashboardApi;
