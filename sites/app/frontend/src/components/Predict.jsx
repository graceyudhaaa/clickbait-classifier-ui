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
import React, { useState } from "react";

function Predict() {
  const [headline, setHeadline] = useState("");
  const [validate, setValidate] = useState(true);
  const [stopword, setStopword] = useState(true);
  const [stemming, setStemming] = useState(true);
  const [lstm, setLstm] = useState(true);
  const [embedding, setEmbedding] = useState(true);
  const [predicted, setPredicted] = useState(false);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useBestThreshold, setUseBestThreshold] = useState(false);

  const handlePredictClick = (event) => {
    if (headline === "") {
      setValidate(false);
      return none;
    }
    setIsLoading(true);
    setValidate(true);
    fetch("http://127.0.0.1:5000/api/predict", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        text: headline,
        stopword: stopword === true ? "stopword_removed" : "stopword_in",
        stemming: stemming === true ? "stemmed" : "not_stemmed",
        lstm: lstm === true ? "bidirectional" : "non_bidirectional",
        embedding: embedding === true ? "word2vec" : "keras_embedding",
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        setResult(response);
        setIsLoading(false);
        setPredicted(true);
      });
  };

  const floatToTime = (second) => {
    var runtime = [];

    var hours = Math.floor(second / 3600);
    var minutes = Math.floor((second - hours * 3600) / 60);
    var seconds = Math.floor(second - hours * 3600 - minutes * 60);

    if (hours != 0) {
      runtime.push(hours.toString() + " hour");
    }
    if (minutes != 0) {
      runtime.push(minutes.toString() + " minute");
    }
    if (seconds != 10) {
      runtime.push(seconds.toString() + " second");
    }
    return runtime.join(" ");
  };

  const clickbaitText = (
    <Typography
      display="flex"
      justifyContent="center"
      alignItems="center"
      align="center"
      variant="h1"
      component="div"
      sx={{ fontWeight: 700, fontSize: 72, height: 200, color: "#bb2c2c" }}
    >
      CLICKBAIT
    </Typography>
  );

  const nonClickbaitText = (
    <Typography
      display="flex"
      justifyContent="center"
      alignItems="center"
      align="center"
      variant="h1"
      component="div"
      sx={{ fontWeight: 700, fontSize: 72, height: 200, color: "#2cbb54" }}
    >
      NOT CLICKBAIT
    </Typography>
  );

  const resultReport = (
    <Box display="flex" flexDirection="column" justifyContent="center">
      {/* NOT CLICKBAIT */}
      {useBestThreshold
        ? result.result_best_threshold
          ? clickbaitText
          : nonClickbaitText
        : result.result
        ? clickbaitText
        : nonClickbaitText}
      <Typography
        display="flex"
        justifyContent="center"
        variant="subtitle1"
        component="div"
        sx={{ fontWeight: 500 }}
      >
        Score: {result.score}
      </Typography>
      <Typography
        display="flex"
        justifyContent="center"
        variant="subtitle1"
        component="div"
      >
        Runtime: {floatToTime(result.runtime)}
      </Typography>
      <Box mb={2} display="flex" justifyContent="center">
        <FormControlLabel
          control={
            <Switch
              checked={useBestThreshold}
              name="threshold"
              color="success"
              size="small"
              onChange={() => {
                setUseBestThreshold(!useBestThreshold);
              }}
            />
          }
          label={
            <Typography variant="caption">
              use best threshold ({result.best_threshold})
            </Typography>
          }
        />
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
        <Stack direction="column">
          <Typography
            display="flex"
            justifyContent="center"
            variant="h1"
            component="div"
            sx={{ fontWeight: 500, fontSize: 24 }}
          >
            Predict Headline
          </Typography>
          {/* Display result */}
          <Box
            height={300}
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
              <Fade in={predicted && !isLoading} timeout={1000}>
                {resultReport}
              </Fade>
            )}
          </Box>
          {/* Display result */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={10}>
              <FormGroup display="flex">
                <FormControl>
                  <TextField
                    sx={{ display: "flex" }}
                    error={!validate}
                    helperText={validate ? "" : "You need to input headline!"}
                    id="outlined-basic"
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
                onClick={handlePredictClick}
              >
                Predict
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
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}

export default Predict;
