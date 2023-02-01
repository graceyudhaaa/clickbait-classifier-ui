import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import React from "react";

function Footer() {
  return (
    <Box sx={{ bgcolor: "#1e1e1e", color: "white", mt: 6 }}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Stack spacing={4}>
          <Typography variant="caption">Grace Yudha Satriawan</Typography>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;
