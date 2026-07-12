import { RetailTransaction } from "@/types/retail";
import { Box, Flex, Grid, GridCol, Text, Title } from "@mantine/core";

interface TransactionListProps {
  data: RetailTransaction[];
}

function TransactionList({ data }: TransactionListProps) {

  const TransactionCard = ({data} : {data: RetailTransaction}) => {
    return (
      <Box
        p="8px 16px"
        bg="rgba(255, 255, 255, 0.07)"
        style={{
          backdropFilter: "blur(20px)",
          "-webkit-backdrop-filter": " blur(20px)",
        }}
      >
        <Text>Montant: {data.amount}</Text>
      </Box>
    );
  }
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