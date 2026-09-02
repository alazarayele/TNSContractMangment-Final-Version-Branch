import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { Link , useLocation} from "react-router-dom";




export const Navbar = () => {
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ backgroundColor: '#4CAF50' }}>
      <Toolbar>
        {/* Logo/Title (Left-aligned) */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Contract Manager
        </Typography>

        {/* Navigation Buttons (Right-aligned) */}
        <Box>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{
              fontWeight: location.pathname === "/" ? "bold" : "normal",
              mx: 1,
            }}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/add"
            sx={{
              fontWeight: location.pathname === "/add" ? "bold" : "normal",
              mx: 1,
            }}
          >
            Add Contract
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};