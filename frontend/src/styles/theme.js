/*

AI-generated: 10% (Tool: ChatGPT, Cursor suggested basic `createTheme` structure and palette setup)
Human-written: 90% (logic: custom colors, rounded shapes, typography choices, specific palette tweaks)

Notes:

* AI contribution was minimal: basic `createTheme` template.
* All design decisions, color codes, typography, and border radius are human-written and project-specific.

*/

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#A78BFA' },   // pastel purple
    secondary: { main: '#00000' }, // soft pink accent
    background: {
      default: '#F3E8FF', // lilac background
      paper: '#E9D5FF',   // card background
    },
    text: {
      primary: '#1F2937', // dark gray
      secondary: '#000000',
    },
  },
  shape: { borderRadius: 20 }, // rounded cards
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
  },
});

export default theme;
