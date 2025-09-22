//roughly 50% is from MUI documentation, 50% handwritten

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Logo from './Logo';

function Banner(){
    return (<Box 
          sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
      }}>
      <AppBar position="static" >
        <Toolbar>
            <div  style={{display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center", margin: "auto"}}>
                <Typography align="center" variant="h4" component="div" color="rgb(66 33 111)">
                    PlanningJam
                </Typography>
                <Logo></Logo>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
    )
}

export default Banner;