import { retailBaseApi } from "./retailBaseApi";

export const authRetailApi = retailBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    retailLogout: builder.mutation<void, void>({
      query: () => ({
        url: "/retail/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useRetailLogoutMutation } = authRetailApi;
