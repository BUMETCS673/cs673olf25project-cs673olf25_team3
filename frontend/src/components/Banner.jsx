/*

AI-generated: 10%: Used to get logout button, used to conditionally render component sizes
From Documentation: 30% (from MUI documentation: AppBar, Toolbar, Box usage patterns, basic layout examples)
Human-written: 60% (logic: custom Banner component, Typography text, Logo placement, flex styling, color choices)

Notes:

Layout structure and MUI component usage were adapted from documentation examples.

Customizations, styling, and integration with the Logo component are fully human-written.

*/

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Logo from './Logo';
import useMediaQuery from '@mui/material/useMediaQuery';

import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import {IconButton} from '@mui/material';

import { useAuth } from '../auth/AuthContext';
import {Button} from '@mui/material';
import { Link } from 'react-router-dom';
import {Tooltip } from '@mui/material';


function Banner(){
    const { auth } = useAuth();
    const isMobile = useMediaQuery('(max-width:600px)');

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
                <Typography align="center" style={isMobile ? {fontSize : "4vw"}: {}}  variant="h4"  component="div" color="rgb(66 33 111)">
                    PlanningJam
                </Typography>
                <Logo style={isMobile ? {width : "30px"}: {}} />
            </div>
            {auth.accessToken && 
              <div>
                  <Tooltip title="Home">
                    <IconButton size="large"  color="inherit" component={Link} to="/home" >
                      <HomeIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Friends">
                    <IconButton size="large"  color="inherit" component={Link} to="/friends" >
                      <GroupIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="User Profile">
                    <IconButton size="large"  color="inherit" component={Link} to="/profile" >
                      <AccountBoxIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Logout">
                    <Button  color={"secondary"} component={Link} to="/logout" >
                      Logout
                    </Button>
                  </Tooltip>
              </div>
              }
        </Toolbar>
      </AppBar>
    </Box>
    )
}

export default Banner;