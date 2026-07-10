import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include",
});

export const retailBaseApi = createApi({
  baseQuery,
  tagTypes: [],
  endpoints: () => ({}),
});
