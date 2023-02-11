import React, { useState } from "react";
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
  CircularProgress,
  Fade,
} from "@mui/material";
import EvaluationReport from "./EvaluationReport";

function Models() {
  const [stopword, setStopword] = useState(true);
  const [stemming, setStemming] = useState(true);
  const [lstm, setLstm] = useState(true);
  const [embedding, setEmbedding] = useState(true);
  const [calculated, setCalculated] = useState(false);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckClick = (event) => {
    setIsLoading(true);
    fetch("http://127.0.0.1:5000/api/about", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        stopword: stopword === true ? "stopword_removed" : "stopword_in",
        stemming: stemming === true ? "stemmed" : "not_stemmed",
        lstm: lstm === true ? "bidirectional" : "non_bidirectional",
        embedding: embedding === true ? "word2vec" : "keras_embedding",
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setResult(response);
        console.log(result);
        setIsLoading(false);
        setCalculated(true);
      });
  };

  return (
    <Box
      p={2}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      minHeight="100vh"
    >
      <Container>
        <Typography
          display="flex"
          justifyContent="center"
          variant="h1"
          component="div"
          mt={5}
          sx={{ fontWeight: 500, fontSize: 24 }}
        >
          About Model
        </Typography>
        {/* Display result */}
        <Box
          // height={300}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          {calculated ? (
            <Fade in={!isLoading} timeout={1000}>
              <div>
                <EvaluationReport
                  roc_curve={result.roc_curve}
                  confusion_matrix={result.confusion_matrix}
                  confusion_matrix_best_threshold={
                    result.confusion_matrix_best_threshold
                  }
                  stopword={result.stopword}
                  stemming={result.stemming}
                  lstm_mode={result.lstm_mode}
                  embedding={result.embedding}
                  classification_report={result.classification_report}
                  classification_report_best_threshold={
                    result.classification_report_best_threshold
                  }
                  roc_auc_report={result.roc_auc_report}
                />
              </div>
            </Fade>
          ) : (
            <Box height={300} />
          )}
          {/* {isLoading ? (
              <Fade in={isLoading} timeout={1000}>
                <CircularProgress size={100} />
              </Fade>
            ) : (
              <Fade in={predicted && !isLoading} timeout={1000}>
                {resultReport}
              </Fade>
            )} */}
        </Box>
        {/* Display result */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <FormControl
                  sx={{ width: "100%" }}
                  component="fieldset"
                  variant="standard"
                >
                  <FormLabel component="legend">Model Configuration</FormLabel>
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
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={lstm}
                              name="lstm"
                              value="bidirectional"
                              onChange={() => {
                                setLstm(!lstm);
                              }}
                            />
                          }
                          label="Bidirectional LSTM"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={embedding}
                              name="embedding"
                              value="word2vec"
                              onChange={() => {
                                setEmbedding(!embedding);
                              }}
                            />
                          }
                          label="Word2vec"
                        />
                      </Grid>
                    </Grid>
                  </FormGroup>
                </FormControl>
                <Grid
                  container
                  direction="row"
                  justify="flex-end"
                  sx={{ mt: 2 }}
                >
                  <Grid item xs={0} md={10}></Grid>
                  <Grid item xs={12} md={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        minHeight: 55,
                        float: "right",
                        justify: "flex-end",
                      }}
                      onClick={handleCheckClick}
                    >
                      Check
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Models;
