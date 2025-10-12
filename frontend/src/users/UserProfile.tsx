/*
AI-generated: 30% (Tool: ChatGPT; primarily component structure, useEffect skeleton )
Human-written: 70% (logic: conditional fetching of plan data in edit mode, calling getPlanById, handling API errors, integrating addPlan and editPlan endpoints on submit, navigation to /home on success)

Notes:

AI contributed to the structural layout and useEffect setup.

Human contributions cover all functional logic for data fetching, edit vs add handling, API integration, state management, and navigation.

Prefilling the form and handling API error responses is human-authored.
*/

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { getProfile } from "./endpoints/getProfile"
import { Button, Typography } from "@mui/material";
import {Box} from "@mui/material";

export default function UserBio() {
  const { auth } = useAuth();
  const [initialData, setInitialData] = useState<any>(null);
  const [dateJoined, setDateJoined] = useState<any>(null)
  const navigate = useNavigate();
  
  useEffect(() => {
    if (auth.accessToken) {
      async function loadUserBio() {
        const result = await getProfile(auth.accessToken as string);
        if ("errorMessage" in result && result.errorMessage) {
          console.error(result.errorMessage);
        } else {
          setInitialData(result);
        }
      }
      loadUserBio();
    }
  }, [auth.accessToken]);

  useEffect(()=>{
    if (initialData){
      let newDate = new Date(initialData.date_joined)
      let formattedDate =  `${newDate.getFullYear()}-${String(newDate.getMonth()).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`
      setDateJoined(formattedDate)
    }
    setDateJoined
  }, [initialData])



  return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 2,
          mt: 1,
        }}
      >
      {initialData &&  <Typography variant="h5" fontWeight={600}>{initialData.username}</Typography>}
      {initialData && <div>Email: {initialData.email}</div>}
      {initialData && <div>First Name: {initialData.first_name}</div>}
      {initialData && <div>Last Name: {initialData.last_name}</div>}
      {initialData && <div>Birthday: {initialData.date_of_birth}</div>}
      {initialData && <div>Bio: {initialData.bio}</div>}
      {dateJoined && <div>Date Joined :{dateJoined}</div>}
      <Button onClick={() => {
            navigate('/profile/edit')
      }}>Edit</Button>
    </Box>
  )
}
