"use client"

import RetailForm from "@/components/retail/form/RetailForm";
import RetailGrid from "@/components/retail/grid/RetailGrid";
import { useGetParametersQuery } from "@/lib/retailApi/parametersApi";
import { Box, Flex, Title } from "@mantine/core";

function RetailView() {
  const { data, isLoading, error } = useGetParametersQuery();

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        maxWidth: 1440,
        margin: "0 auto",
        padding: "0 32px",
      }}
    >
      {/* <Box maw="300" style={{margin: "auto"}}>
        <RetailForm data={data} />
      </Box> */}
      <Flex h={100} align="center">
        <Title order={3}>Mises à jour GPS Mercedes</Title>
      </Flex>
      <RetailGrid data={data} isLoading={isLoading} />
    </div>
  );
}

export default RetailView