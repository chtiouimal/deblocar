"use client"

import RetailForm from "@/components/retail/form/RetailForm";
import { useGetParametersQuery } from "@/lib/retailApi/parametersApi";
import { Box } from "@mantine/core";

function RetailView() {
  const { data, isLoading, error } = useGetParametersQuery();
  return (
    <div style={{width: "100%", height: "100vh"}}>
      <Box maw="300" style={{margin: "auto"}}>
        <RetailForm data={data} />
      </Box>
    </div>
  );
}

export default RetailView