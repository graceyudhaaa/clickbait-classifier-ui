import React from "react";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
  Typography,
  Grid,
} from "@mui/material";

function EvaluationReport(props) {
  return (
    <Box>
      <Typography sx={{ my: 2 }} align="justify" variant="body1" gutterBottom>
        Model ditraining dengan 10050 data yang diaplikasikan dengan fungsi text
        preprocessing{" "}
        {props.stopword == "stopword_in"
          ? "tanpa stopword removal"
          : "dengan stopword removal"}{" "}
        dan{" "}
        {props.stemming == "not_stemmed"
          ? "tanpa proses stemming"
          : "dengan proses stemming"}
        , Model menggunakan algoritma{" "}
        {props.lstm_mode == "bidirectional" ? "Bidirectional LSTM" : "LSTM"} dan
        word embedding{" "}
        {props.embedding == "word2vec" ? "Word2Vec" : "Keras Embedding"}.
      </Typography>
      <Typography sx={{ my: 2 }} align="justify" variant="body1" gutterBottom>
        Data kemudian dievaluasi menggunakan 4950 data training. Evaluasi
        tersebut menghasilkan nilai ROC-AUC dari model sebesar{" "}
        {props.roc_auc_report["auc_score"]} dan Threshold terbaik pada nilai{" "}
        {props.roc_auc_report["best_threshold"]} dengan nilai G-Mean sebesar{" "}
        {props.roc_auc_report["best_threshold_gmean"]}
      </Typography>

      <Grid container justify="center">
        <Grid
          item
          alignItems="center"
          xs={12}
          sx={{ justifyContent: "center", display: "flex" }}
        >
          <img
            sx={{ margin: 2 }}
            src={"data:image/png;base64, " + props.roc_curve}
            alt=""
          />
        </Grid>
      </Grid>
      <Typography sx={{ my: 2 }} align="justify" variant="body1" gutterBottom>
        Berikut merupakan confusion matrix dan classification report dari model
        yang dievaluasi pada data training dengan threshold 0.5
      </Typography>
      <Grid container justify="center">
        <Grid
          item
          alignItems="center"
          xs={12}
          sx={{ justifyContent: "center", display: "flex" }}
        >
          <img
            sx={{ margin: 2 }}
            src={"data:image/png;base64, " + props.confusion_matrix}
            alt="confusion matrix dari model yang dievaluasi pada data training dengan threshold 0.5"
          />
        </Grid>
      </Grid>

      <ClassficationReportTable report={props.classification_report} />

      <Typography sx={{ my: 2 }} align="justify" variant="body1" gutterBottom>
        Dan berikut merupakan confusion matrix dan classification report dari
        model yang dievaluasi pada data training dengan threshold terbaik
      </Typography>

      <Grid container justify="center">
        <Grid
          item
          alignItems="center"
          xs={12}
          sx={{ justifyContent: "center", display: "flex" }}
        >
          <img
            sx={{ margin: 2 }}
            src={
              "data:image/png;base64, " + props.confusion_matrix_best_threshold
            }
            alt="confusion matrix dari model yang dievaluasi pada data training dengan threshold terbaik"
          />
        </Grid>
      </Grid>

      <ClassficationReportTable
        report={props.classification_report_best_threshold}
      />
    </Box>
  );

  function ClassficationReportTable(props) {
    return (
      <Box
        sx={{
          margin: 2,
          width: "100%",
          display: "table",
          tableLayout: "fixed",
        }}
      >
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell align="right">precision</TableCell>
                <TableCell align="right">recall</TableCell>
                <TableCell align="right">f1-score</TableCell>
                <TableCell align="right">support</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                key="classification report"
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Typography
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    0
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {props.report["0"]["precision"]}
                </TableCell>
                <TableCell align="right">
                  {props.report["0"]["recall"]}
                </TableCell>
                <TableCell align="right">
                  {props.report["0"]["f1-score"]}
                </TableCell>
                <TableCell align="right">
                  {props.report["0"]["support"]}
                </TableCell>
              </TableRow>
              <TableRow
                key="classification report"
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Typography
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    1
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {props.report["1"]["precision"]}
                </TableCell>
                <TableCell align="right">
                  {props.report["1"]["recall"]}
                </TableCell>
                <TableCell align="right">
                  {props.report["1"]["f1-score"]}
                </TableCell>
                <TableCell align="right">
                  {props.report["1"]["support"]}
                </TableCell>
              </TableRow>
              <TableRow
                key="classification report"
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Typography
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    accuracy
                  </Typography>
                </TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right">{props.report["accuracy"]}</TableCell>
                <TableCell align="right">
                  {props.report["macro avg"]["support"]}
                </TableCell>
              </TableRow>
              <TableRow
                key="classification report"
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Typography
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    macro avg
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {props.report["macro avg"]["precision"]}
                </TableCell>
                <TableCell align="right">
                  {props.report["macro avg"]["recall"]}
                </TableCell>
                <TableCell align="right">
                  {props.report["macro avg"]["f1-score"]}
                </TableCell>
                <TableCell align="right">
                  {props.report["macro avg"]["support"]}
                </TableCell>
              </TableRow>
              <TableRow
                key="classification report"
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Typography
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    weighted avg
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  {props.report["weighted avg"]["precision"]}
                </TableCell>
                <TableCell align="right">
                  {props.report["weighted avg"]["recall"]}
                </TableCell>
                <TableCell align="right">
                  {props.report["weighted avg"]["f1-score"]}
                </TableCell>
                <TableCell align="right">
                  {props.report["weighted avg"]["support"]}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }
}

export default EvaluationReport;
