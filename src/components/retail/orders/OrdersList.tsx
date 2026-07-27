import { RETAIL_ORDER_STATUS } from "@/constants/retail";
import { RetailOrder, RetailOrderStatus } from "@/types/retail";
import { formatDateTime } from "@/utils/formatDate";
import { Badge, Box, Flex, Grid, GridCol, Pagination, Text, Title } from "@mantine/core";
import { CalendarCheckIcon, ClockIcon, CoinsIcon, CreditCardIcon } from "@phosphor-icons/react";

interface OrdersListProps {
  data: RetailOrder[];
  pagination: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
  onPageChange: (page: number) => void;
}

function OrdersList({ data, pagination, onPageChange }: OrdersListProps) {
  const OrderCard = ({ data }: { data: RetailOrder }) => {
    const { date, time } = formatDateTime(data?.createdAt);
    const status = RETAIL_ORDER_STATUS[data?.status as RetailOrderStatus];
    return (
      <Flex
        direction="column"
        gap={16}
        p="8px 16px"
        bg="rgba(255, 255, 255, 0.07)"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: " blur(20px)",
        }}
      >
        <Flex justify="space-between" align="center" gap={16}>
          <Flex gap={16}>
            <Flex align="center" gap={4}>
              <ClockIcon size={16} weight="thin" />
              <Text size="xs">{time}</Text>
            </Flex>
            <Flex align="center" gap={4}>
              <CalendarCheckIcon size={16} weight="thin" />
              <Text size="xs">{date}</Text>
            </Flex>
          </Flex>
          <Badge color={status.color}>{status.label}</Badge>
        </Flex>
        <Box>
          <Flex gap={16}>
            <Text fz="xs" c="dimmed">
              Paiment:
            </Text>
            <Flex align="center" gap={4}>
              {data?.paymentMethod === "card" ? (
                <CreditCardIcon size={16} weight="thin" />
              ) : (
                <CoinsIcon size={16} weight="thin" />
              )}{" "}
              <Text size="xs">
                {data?.paymentMethod === "card" ? "carte" : "crédit"}
              </Text>
            </Flex>
          </Flex>
          <Flex gap={16}>
            <Text fz="xs" c="dimmed">
              Codes générer:
            </Text>
            <Text fz="xs">
              {data?.totalItems} {data?.totalItems > 1 ? "codes" : "code"}
            </Text>
          </Flex>
        </Box>
        <Flex justify="flex-end">
          <Flex gap={4}>
            <Title order={5}>
              {data?.payment
                ? data?.payment?.amount
                : data?.transaction
                  ? data?.transaction?.amount
                  : "Non défini"}
            </Title>
            <Text c="dimmed">
              {data?.payment
                ? data?.payment?.currency
                : data?.transaction
                  ? "crédits"
                  : ""}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    );
  };

  return (
    <>
      <Grid p="32px 0">
        {data?.map((e) => (
          <GridCol span={6} key={e._id}>
            <OrderCard data={e} />
          </GridCol>
        ))}
      </Grid>

      {pagination.pages > 1 && (
        <Flex justify="center" mt="xl">
          <Pagination
            value={pagination.page}
            total={pagination.pages}
            onChange={onPageChange}
          />
        </Flex>
      )}
    </>
  );
}

export default OrdersList