import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  FormControlLabel,
  Switch,
  FormGroup,
  FormLabel,
  FormControl,
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

function TextPreprocessing() {
  const [headline, setHeadline] = useState("");
  const [stopword, setStopword] = useState(true);
  const [stemming, setStemming] = useState(true);
  const [validate, setValidate] = useState(true);
  const [preprocessed, setPreprocessed] = useState(false);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePreprocessClick = (event) => {
    if (headline === "") {
      setValidate(false);
      return null;
    }
    setIsLoading(true);
    setValidate(true);
    fetch("http://127.0.0.1:5000/api/preprocess", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        text: headline,
        stopword: stopword === true ? "stopword_removed" : "stopword_in",
        stemming: stemming === true ? "stemmed" : "not_stemmed",
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setResult(response);
        setIsLoading(false);
        setPreprocessed(true);
      });
  };

  const preprocessResult = (
    <Box sx={{ overflow: "auto", overflowX: "auto" }}>
      <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
        <TableContainer component={Paper}>
          <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Step</TableCell>
                <TableCell>Preprocessing Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={result.text}>
                <TableCell component="th" scope="row">
                  Original Text
                </TableCell>
                <TableCell component="th" scope="row">
                  {result.text}
                </TableCell>
              </TableRow>
              <TableRow key={result.casefolding}>
                <TableCell component="th" scope="row">
                  Casefolding
                </TableCell>
                <TableCell component="th" scope="row">
                  {result.casefolding}
                </TableCell>
              </TableRow>
              <TableRow key={result.replace_exclamation_question}>
                <TableCell component="th" scope="row">
                  Replace Exclamation & Question Mark
                </TableCell>
                <TableCell component="th" scope="row">
                  {result.replace_exclamation_question}
                </TableCell>
              </TableRow>
              <TableRow key={result.remove_punct}>
                <TableCell component="th" scope="row">
                  Remove Punctuation
                </TableCell>
                <TableCell component="th" scope="row">
                  {result.remove_punct}
                </TableCell>
              </TableRow>
              <TableRow key={result.replace_num}>
                <TableCell component="th" scope="row">
                  Remove Number
                </TableCell>
                <TableCell component="th" scope="row">
                  {result.replace_num}
                </TableCell>
              </TableRow>
              {stopword && (
                <TableRow key={result.remove_stopword}>
                  <TableCell component="th" scope="row">
                    Remove Stopword
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {result.remove_stopword}
                  </TableCell>
                </TableRow>
              )}
              {stemming && (
                <TableRow key={result.stemming}>
                  <TableCell component="th" scope="row">
                    Stemming
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {result.stemming}
                  </TableCell>
                </TableRow>
              )}
              <TableRow key={result.tokenized}>
                <TableCell component="th" scope="row">
                  Tokenized
                </TableCell>
                <TableCell component="th" scope="row">
                  {preprocessed
                    ? "[ " + result.tokenized.join(", ") + " ]"
                    : null}
                </TableCell>
              </TableRow>
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
            variant="h1"
            component="div"
            mt={5}
            sx={{ fontWeight: 500, fontSize: 24 }}
          >
            Text Preprocessing
          </Typography>
          {/* Display result */}
          <Box
            height={300}
            my={2}
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
              <Fade in={preprocessed && !isLoading} timeout={1000}>
                {preprocessResult}
              </Fade>
            )}
          </Box>
          {/* Display result */}
          <Grid container spacing={2} sx={{ pt: 2 }}>
            <Grid item xs={12} md={10}>
              <FormGroup display="flex">
                <FormControl>
                  <TextField
                    sx={{ display: "flex" }}
                    error={!validate}
                    helperText={validate ? "" : "You need to input headline!"}
                    id="headline"
                    label="Headline"
                    variant="outlined"
                    onChange={(event) => {
                      setHeadline(event.target.value);
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
                onClick={handlePreprocessClick}
              >
                Preprocess
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
                      Function Configuration
                    </FormLabel>
                    <FormGroup>
                      <Grid container>
                        <Grid item xs={12} sm={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={stopword}
                                name="stopword"
                                value="stopword_removed"
                                onChange={() => {
                                  setStopword(!stopword);
                                }}
                              />
                            }
                            label="Stopword Removal"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={stemming}
                                name="stemming"
                                value="stemmed"
                                onChange={() => {
                                  setStemming(!stemming);
                                }}
                              />
                            }
                            label="Stemmed"
                          />
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

export default TextPreprocessing;
