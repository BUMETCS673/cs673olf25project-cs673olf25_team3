/*

AI-generated: 10%: Used to get logout button
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

import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import {IconButton} from '@mui/material';

import AuthProtectedRoute from '../auth/AuthProtectedRoute';
import { Navigate } from 'react-router-dom';
import {Button} from '@mui/material';
import { Link } from 'react-router-dom';
import {Tooltip } from '@mui/material';

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
                <Logo/>
            </div>
            <AuthProtectedRoute>
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
                  <Tooltip title="Logout">
                    <Button  color={"secondary"} component={Link} to="/logout" >
                      Logout
                    </Button>
                  </Tooltip>
              </div>
            </AuthProtectedRoute>
        </Toolbar>
      </AppBar>
    </Box>
    )
}

export default Banner;