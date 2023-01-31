import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormLabel,
  Grid,
  Card,
  CardContent,
  Container,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Fade,
} from "@mui/material";
import React, { useState } from "react";

function Cosmul() {
  const [corpus, setCorpus] = useState("");
  const [positive, setPositve] = useState("");
  const [negative, setNegative] = useState("");
  const [dimension, setDimension] = useState("");
  const [algorithm, setAlgorithm] = useState("");
  const [validate, setValidate] = useState(true);
  const [calculated, setCalculated] = useState(false);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCosmulClick = (event) => {
    if (!positive || !negative || !corpus || !dimension || !algorithm) {
      setValidate(false);
      return null;
    }
    setIsLoading(true);
    setValidate(true);
    fetch("http://127.0.0.1:5000/api/word2vec_sim_cosmul", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        text_positive: positive,
        text_negative: negative,
        corpus: corpus,
        dimension: dimension,
        algorithm: algorithm,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setResult(response);
        setIsLoading(false);
        setCalculated(true);
      });
  };

  const cosmulResult = (
    <Box sx={{ overflow: "auto", overflowX: "auto" }}>
      <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
        <TableContainer component={Paper}>
          <Table stickyHeader aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Word</TableCell>
                <TableCell>Cosine Similarities</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!!result &&
                result.map((row) => {
                  return (
                    <TableRow key={row[0]}>
                      <TableCell component="th" scope="row">
                        {row[0]}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row[1]}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );

  return (
    <Box
      p={2}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      minHeight="100vh"
    >
      <Container>
        <Stack direction="column" alignItems="center">
          <Typography
            display="flex"
            justifyContent="center"
            align="center"
            variant="h1"
            component="div"
            mt={5}
            sx={{ fontWeight: 500, fontSize: 24 }}
          >
            Word2vec Word Multiplicative Combination
          </Typography>
          {/* Display result */}
          <Box
            height={300}
            py={3}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            {isLoading ? (
              <Fade in={isLoading} timeout={1000}>
                <CircularProgress size={100} />
              </Fade>
            ) : (
              <Fade in={calculated && !isLoading} timeout={1000}>
                {cosmulResult}
              </Fade>
            )}
          </Box>
          {/* Display result */}
          <Grid container spacing={2} sx={{ pt: 2 }}>
            <Grid item xs={12}>
              <FormGroup display="flex">
                <FormControl>
                  <TextField
                    sx={{ display: "flex" }}
                    error={!validate && !positive}
                    helperText={
                      !validate && !positive
                        ? "You need to input the positive word!"
                        : ""
                    }
                    id="positive"
                    label="Positive"
                    variant="outlined"
                    onChange={(event) => {
                      setPositve(event.target.value);
                    }}
                  />
                </FormControl>
              </FormGroup>
            </Grid>
            <Grid item xs={12} md={10}>
              <FormGroup display="flex">
                <FormControl>
                  <TextField
                    sx={{ display: "flex" }}
                    error={!validate && !negative}
                    helperText={
                      !validate && !negative
                        ? "You need to input the negative word!"
                        : ""
                    }
                    id="negative"
                    label="Negative"
                    variant="outlined"
                    onChange={(event) => {
                      setNegative(event.target.value);
                    }}
                  />
                </FormControl>
              </FormGroup>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                fullWidth
                sx={{ minHeight: 55 }}
                onClick={handleCosmulClick}
              >
                <Typography variant="button" sx={{ lineHeight: "20px" }}>
                  Calculate
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <FormControl
                    sx={{ width: "100%" }}
                    component="fieldset"
                    variant="standard"
                  >
                    <FormLabel component="legend">
                      Model Configuration
                    </FormLabel>
                    <FormGroup sx={{ mt: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControl fullWidth error={!validate && !corpus}>
                            <InputLabel id="demo-simple-select-label">
                              Corpus
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={corpus}
                              label="Corpus"
                              onChange={(event) => {
                                setCorpus(event.target.value);
                              }}
                            >
                              <MenuItem value="leipzig">Leipzig</MenuItem>
                              <MenuItem value="idwiki">Wikipedia</MenuItem>
                            </Select>
                            {!validate && !corpus && (
                              <FormHelperText>
                                You need to choose the corpus!
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControl
                            fullWidth
                            disabled={!corpus}
                            error={!validate && !dimension}
                          >
                            <InputLabel id="demo-simple-select-label">
                              Embedding Dimension
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={dimension}
                              label="Embedding Dimension"
                              onChange={(event) => {
                                setDimension(event.target.value);
                              }}
                            >
                              <MenuItem value={100}>100</MenuItem>
                              <MenuItem value={200}>200</MenuItem>
                              {corpus === "leipzig" && (
                                <MenuItem value={300}>300</MenuItem>
                              )}
                            </Select>
                            {!validate && !dimension && (
                              <FormHelperText>
                                You need to choose the embedding dimension!
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControl
                            fullWidth
                            disabled={!corpus}
                            error={!validate && !algorithm}
                          >
                            <InputLabel id="demo-simple-select-label">
                              Training Algorithm
                            </InputLabel>
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={algorithm}
                              label="Training Algorithm"
                              onChange={(event) => {
                                setAlgorithm(event.target.value);
                              }}
                            >
                              <MenuItem value="cbow">CBOW</MenuItem>
                              {corpus === "leipzig" && (
                                <MenuItem value="skipgram">Skip-gram</MenuItem>
                              )}
                            </Select>
                            {!validate && !algorithm && (
                              <FormHelperText>
                                You need to choose the training algorithm!
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                      </Grid>
                    </FormGroup>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}

export default Cosmul;
