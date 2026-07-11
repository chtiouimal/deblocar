import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include",
});

export const baseApi = createApi({
  baseQuery,
  tagTypes: [
    "Users",
    "Services",
    "Status",
    "Leads",
    "Devis",
    "Calendar",
    "Dashboard",
    "Retail",
  ],
  endpoints: () => ({}),
});
