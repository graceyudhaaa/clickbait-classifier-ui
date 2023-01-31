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
} from "@mui/material";
import React, { useState } from "react";

function Predict() {
  const [headline, setHeadline] = useState("");
  const [stopword, setStopword] = useState(true);
  const [stemming, setStemming] = useState(true);
  const [lstm, setLstm] = useState(true);
  const [embedding, setEmbedding] = useState(true);

  const result = (
    <Box display="flex" flexDirection="column" justifyContent="center">
      <Typography
        display="flex"
        justifyContent="center"
        alignItems="center"
        variant="h1"
        component="div"
        sx={{ fontWeight: 700, fontSize: 64, height: 200 }}
      >
        NOT CLICKBAIT
      </Typography>
      <Typography
        display="flex"
        justifyContent="center"
        variant="subtitle1"
        component="div"
      >
        Score: 0.02324255
      </Typography>
      <Box mb={2} display="flex" justifyContent="center">
        <FormControlLabel
          control={<Switch name="threshold" color="success" size="small" />}
          label={<Typography variant="caption">use best threshold</Typography>}
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
          <Box height={250}></Box>
          {/* Display result */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={10}>
              <FormGroup display="flex">
                <FormControl>
                  <TextField
                    sx={{ display: "flex" }}
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
                onClick={() => {
                  console.log({
                    text: headline,
                    stopword:
                      stopword === true ? "stopword_removed" : "stopword_in",
                    stemming: stemming === true ? "stemmed" : "not_stemmed",
                    lstm: lstm === true ? "bidirectional" : "non_bidirectional",
                    embedding:
                      embedding === true ? "word2vec" : "keras_embedding",
                  });
                }}
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
                                defaultChecked
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
                                defaultChecked
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
                                defaultChecked
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
                                defaultChecked
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
