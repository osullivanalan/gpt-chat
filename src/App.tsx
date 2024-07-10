import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
//import Sidebar from './components/Sidebar';
import Header from './components/Header';
//import MyMessages from './components/MyMessages';
import MyDbMessages from './components/MyDbMessages';
import { ToastContainer } from 'react-toastify';
//import { ThemeProvider, createTheme } from '@mui/material/styles'
//import { useState } from 'react';
import Settings from './components/Settings';
import { SettingsProvider } from './contexts/SettingsProvider'


export default function App() {

  return (
    <SettingsProvider>
      <CssVarsProvider disableTransitionOnChange defaultMode="dark">
        <CssBaseline />
        <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
          {/*<Sidebar />*/}
          <Header />
          <Box component="main" className="MainContent" sx={{ flex: 1 }}>
            <MyDbMessages />
            <ToastContainer />
            <Settings />
          </Box>
        </Box>
      </CssVarsProvider>
    </SettingsProvider>
  );
}
