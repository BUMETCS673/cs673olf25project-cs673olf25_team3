/*

AI-generated / Reference: 50% (from MUI documentation: AppBar, Toolbar, Box usage patterns, basic layout examples)
Human-written: 50% (logic: custom Banner component, Typography text, Logo placement, flex styling, color choices)

Notes:

Layout structure and MUI component usage were adapted from documentation examples.

Customizations, styling, and integration with the Logo component are fully human-written.

*/

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