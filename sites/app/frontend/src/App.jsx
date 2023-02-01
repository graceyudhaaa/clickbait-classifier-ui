import { Box, Stack } from "@mui/system";
import React from "react";
import Predict from "./components/Predict";
import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import TextPreprocessing from "./components/TextPreprocessing";
import Similarities from "./components/Similarities";
import Cosmul from "./components/Cosmul";
import Footer from "./components/Footer";

function App() {
  return (
    <Box>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Predict></Predict>} />
        <Route
          path="/text-preprocessing"
          element={<TextPreprocessing></TextPreprocessing>}
        />
        <Route path="/similarities" element={<Similarities></Similarities>} />
        <Route path="/cosmul" element={<Cosmul></Cosmul>} />
      </Routes>
      <Footer></Footer>
    </Box>
  );
}

export default App;
