import { RetailTransaction } from "@/types/retail";
import { Box, Flex, Grid, GridCol, Text, Title } from "@mantine/core";

interface TransactionListProps {
  data: RetailTransaction[];
}

function TransactionList({ data }: TransactionListProps) {
  const formatDateTime = (date: string) => {
    const d = new Date(date);

    return {
      date: d.toLocaleDateString("fr-FR"),
      time: d.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const TransactionCard = ({ data }: { data: RetailTransaction }) => {
    const { date, time } = formatDateTime(data?.createdAt);
    return (
      <Box
        p="8px 16px"
        bg="rgba(255, 255, 255, 0.07)"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: " blur(20px)",
        }}
      >
        <Text>Montant: {data.amount}</Text>
        <Text>Heure: {time}</Text>
        <Text>Date: {date}</Text>
      </Box>
    );
  };
  return (
    <Grid p="32px 0">
      {data?.map((e, i) => (
        <GridCol span={6} key={i}>
          <TransactionCard data={e} />
        </GridCol>
      ))}
    </Grid>
  );
}

export default TransactionList