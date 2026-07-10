import { retailBaseApi } from "./retailBaseApi";

export const parametersApi = retailBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getParameters: builder.query<any, void>({
      query: () => "/retail/parameters",
    }),
    getGenerateCode: builder.query<
      { pin: string },
      {
        hu: string;
        region: string;
        version: string;
        vin: string;
      }
    >({
      query: (params) => ({
        url: "/retail/generate",
        params,
      }),
    }),
  }),
});

export const { useGetParametersQuery, useLazyGetGenerateCodeQuery } = parametersApi;
