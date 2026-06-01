import { Box, Loader } from '@mantine/core'

function CustomLoader() {
  return (
    <Box
      style={{
        height: "100vh",
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Loader />
    </Box>
  );
}

export default CustomLoader