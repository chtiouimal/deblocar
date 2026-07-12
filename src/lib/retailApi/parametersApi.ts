import { retailBaseApi } from "./retailBaseApi";

export const parametersApi = retailBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getParameters: builder.query<any, void>({
      query: () => "/retail/parameters",
    }),
    getGenerateCode: builder.query<
      { pin: string; balance: number },
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

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          dispatch(retailBaseApi.util.invalidateTags(["RetailTransactions"]));
        } catch {}
      },
    }),
  }),
});

export const { useGetParametersQuery, useLazyGetGenerateCodeQuery } = parametersApi;
