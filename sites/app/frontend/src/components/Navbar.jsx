import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Stack,
  Divider,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { React, useState } from "react";
import { theme } from "../theme";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleRightDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const location = useLocation().pathname;

  return (
    <div>
      <AppBar position="sticky">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h5"
              component="div"
              sx={{ display: { xs: "none", md: "block" }, fontWeight: 500 }}
            >
              Clickbait Classifier
            </Typography>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, display: { xs: "block", sm: "none" } }}
            >
              <HighlightOffOutlinedIcon />
            </IconButton>
          </Box>
          <Stack direction="row" sx={{ display: { xs: "none", md: "block" } }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Button
                variant="text"
                color="inherit"
                sx={{ color: "white", p: 1 }}
              >
                Predict
              </Button>
            </Link>
            <Link to="/models" style={{ textDecoration: "none" }}>
              <Button
                variant="text"
                color="inherit"
                sx={{ color: "white", p: 1 }}
              >
                Models
              </Button>
            </Link>
            <Link to="/text-preprocessing" style={{ textDecoration: "none" }}>
              <Button
                variant="text"
                color="inherit"
                sx={{ color: "white", p: 1 }}
              >
                Text Preprocessing
              </Button>
            </Link>
            <Link to="/similarities" style={{ textDecoration: "none" }}>
              <Button
                variant="text"
                color="inherit"
                sx={{ color: "white", p: 1 }}
              >
                Word2vec Similarities
              </Button>
            </Link>
            <Link to="/cosmul" style={{ textDecoration: "none" }}>
              <Button
                variant="text"
                color="inherit"
                sx={{ color: "white", p: 1 }}
              >
                Word2vec Cosmul
              </Button>
            </Link>
          </Stack>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleRightDrawerToggle}
            sx={{ mr: 2, display: { xs: "block", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box onClick={handleRightDrawerToggle}>
        <Drawer
          PaperProps={{
            sx: {
              backgroundColor: theme.palette.primary.main,
              color: "white",
            },
          }}
          variant="temporary"
          open={mobileOpen}
          anchor="right"
        >
          <Box>
            <Stack direction="column">
              <Divider />
              <Link to="/" style={{ textDecoration: "none" }}>
                <Button
                  variant="text"
                  color="inherit"
                  style={{ justifyContent: "flex-start" }}
                  sx={{ py: 2, color: "white" }}
                >
                  <Typography variant="p" sx={{ fontSize: 14 }}>
                    Predict
                  </Typography>
                </Button>
              </Link>
              <Divider />
              <Link to="/models" style={{ textDecoration: "none" }}>
                <Button
                  variant="text"
                  color="inherit"
                  style={{ justifyContent: "flex-start" }}
                  sx={{ py: 2, color: "white" }}
                >
                  <Typography variant="p" sx={{ fontSize: 14 }}>
                    Models
                  </Typography>
                </Button>
              </Link>
              <Divider />
              <Link to="/text-preprocessing" style={{ textDecoration: "none" }}>
                <Button
                  variant="text"
                  color="inherit"
                  style={{ justifyContent: "flex-start" }}
                  sx={{ py: 2, color: "white" }}
                >
                  <Typography variant="p" sx={{ fontSize: 14 }}>
                    Text Preprocessing
                  </Typography>
                </Button>
              </Link>
              <Divider />
              <Link to="/similarities" style={{ textDecoration: "none" }}>
                <Button
                  variant="text"
                  color="inherit"
                  style={{ justifyContent: "flex-start" }}
                  sx={{ py: 2, color: "white" }}
                >
                  <Typography variant="p" sx={{ fontSize: 14 }}>
                    Word2vec Similarities
                  </Typography>
                </Button>
              </Link>
              <Divider />
              <Link to="/cosmul" style={{ textDecoration: "none" }}>
                <Button
                  variant="text"
                  color="inherit"
                  style={{ justifyContent: "flex-start" }}
                  sx={{ py: 2, color: "white" }}
                >
                  <Typography variant="p" sx={{ fontSize: 14 }}>
                    Word2vec Cosmul
                  </Typography>
                </Button>
              </Link>
              <Divider />
            </Stack>
          </Box>
        </Drawer>
      </Box>
    </div>
  );
}

export default Navbar;
