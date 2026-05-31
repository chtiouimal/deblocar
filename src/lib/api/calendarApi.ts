import { baseApi } from "@/lib/api/baseApi";

export const calendarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCalendar: builder.query<any, { month?: number; year?: number }>({
      query: ({ month, year }) => ({
        url: "/admin/calendar",
        params: { month, year },
      }),
      providesTags: ["Calendar"],
    }),
  }),
});

export const { useGetCalendarQuery } = calendarApi;
