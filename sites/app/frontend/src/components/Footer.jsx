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
        <Stack spacing={2}>
          <Typography variant="h6">Tentang Clickbait</Typography>
          <Typography align="justify" variant="caption">
            Clickbait adalah konten darisebuah website yang sengaja dibuat dan
            didesain untuk membuat pembaca yang tertarik untuk mengeklik tautan
            yang ditampilkan, biasanya konten-konten clickbait disebarkan pada
            media sosial. Clickbait juga dapat menyebabkan kualitas dari
            jurnalisme yang menurun karena lebih mementingkan judul yang lebih
            meninggikan jumlah pengunjung dibandingkan dengan informasi yang
            dikandung oleh artikel berita itu sendiri. Hal ini juga dapat memicu
            penyebaran berita hoaks di masyarakat, yang dapat menimbulkan
            keributan di masyarakat. Sehingga diperlukan cara untuk
            mengklasifikasi clickbait agar dapat mencegah dampak-dampak negatif
            dari clickbait.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;
