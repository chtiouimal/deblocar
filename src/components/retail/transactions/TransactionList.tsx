import { RetailTransaction } from "@/types/retail";
import { formatDateTime } from "@/utils/formatDate";
import {
  Box,
  Flex,
  Grid,
  GridCol,
  Pagination,
  Text,
  Title,
} from "@mantine/core";
import { CalendarCheckIcon, ClockIcon } from "@phosphor-icons/react";

interface TransactionListProps {
  data: RetailTransaction[];
  pagination: {
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
  onPageChange: (page: number) => void;
}

function TransactionList({
  data,
  pagination,
  onPageChange,
}: TransactionListProps) {
  const TransactionCard = ({ data }: { data: RetailTransaction }) => {
    const { date, time } = formatDateTime(data?.createdAt);
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
        <Text>{data.amount} crédits</Text>
        <Flex gap={16}>
          <Flex align="center" gap={4}>
            <ClockIcon size={16} weight="thin" />
            <Text size="sm">{time}</Text>
          </Flex>
          <Flex align="center" gap={4}>
            <CalendarCheckIcon size={16} weight="thin" />
            <Text size="sm">{date}</Text>
          </Flex>
        </Flex>
      </Flex>
    );
  };
  return (
    <>
      <Grid p="32px 0">
        {data?.map((e, i) => (
          <GridCol span={6} key={i}>
            <TransactionCard data={e} />
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

export default TransactionList