import { RetailParameters } from "@/types/retail";
import { Box, Card, Drawer, Flex, Grid, GridCol, Image, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import RetailForm from "../form/RetailForm";
import Link from "next/link";
import { XIcon } from "@phosphor-icons/react";
import CustomLoader from "@/components/core/loading";
import { colors } from "@/theme/colors";

interface RetailGridProps {
  data: RetailParameters[];
  isLoading: boolean;
}

function RetailGrid({ data, isLoading }: RetailGridProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedRetail, setSelectedRetail] = useState<RetailParameters | null>(
    null,
  );
  const RetailCard = ({ data }: { data: RetailParameters }) => {
    const handleClick = () => {
      setSelectedRetail(data);
      open();
    };
    return (
      <Card
        shadow="sm"
        padding="xl"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <Card.Section>
          <Image src={data?.images[0]} h={260} alt={data?.ntgName} />
        </Card.Section>

        <Text fw={500} size="lg" mt="md">
          {data?.ntgName}
        </Text>

        <Text mt="xs" c="dimmed" size="xs">
          {data?.displayName}
        </Text>
        <Text mt={8} size="sm" c={colors.glowingRed[5]}>
          {data?.price} TND
        </Text>
      </Card>
    );
  };

  return isLoading ? (
    <CustomLoader />
  ) : (
    <>
      <Flex justify="flex-end" w="100%">
        <Text fz="sm">
          <b>{data?.length}</b> produit(s)
        </Text>
      </Flex>
      <Grid mt={16} pb={32}>
        {data?.map((e, i) => (
          <GridCol span={{ base: 6, md: 4 }} key={i}>
            <RetailCard data={e} />
          </GridCol>
        ))}
      </Grid>
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="100%"
        // title={selectedRetail?.ntgName}
        withCloseButton={false}
      >
        <Box
          p="32px"
          style={{ maxWidth: 1440, margin: "0 auto", maxHeight: "100vh" }}
        >
          <Flex mb={32} justify="space-between" w="100%">
            <Link href="/" style={{ opacity: 1 }}>
              <Image
                src="/Deblocar_small.svg"
                alt="deblocar-logo"
                width={192}
                height={30}
              />
            </Link>
            <UnstyledButton onClick={close}>
              <XIcon size={32} weight="thin" />
            </UnstyledButton>
          </Flex>
          <RetailForm data={selectedRetail} />
        </Box>
      </Drawer>
    </>
  );
}

export default RetailGrid