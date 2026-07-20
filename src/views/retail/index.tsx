"use client"

import RetailGrid from "@/components/retail/grid/RetailGrid";
import { useGetParametersQuery } from "@/lib/retailApi/parametersApi";
import { Box, Flex, Title } from "@mantine/core";

function RetailView() {
  const { data, isLoading } = useGetParametersQuery();

  return (
    <Box
      style={{
        width: "100%",
        height: "100vh",
        maxWidth: 1440,
        margin: "0 auto",
      }}
      p={{ base: "0 16px", md: "0 32px" }}
    >
      <Flex h={100} align="center">
        <Title order={3}>Mises à jour GPS Mercedes</Title>
      </Flex>
      <RetailGrid data={data} isLoading={isLoading} />
    </Box>
  );
}

export default RetailView