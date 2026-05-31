import { baseApi } from "@/lib/api/baseApi";


export const citiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCities: builder.query<{ cities: any[] }, void>({
      query: () => "/cities?limit=1000",
    }),
  }),
});

export const { useGetCitiesQuery } = citiesApi;
