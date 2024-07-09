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
import {SettingProps} from './types'
import { SettingsContext } from './contexts/SettingsContext'; // Adjust the path as needed
import { useEffect } from 'react';
import IndexedDBHelper from './IndexedDBHelper';

export default function JoyMessagesTemplate() {

  const [openSettings, setSettingsOpen] = React.useState<boolean>(false);
  const [settings, setSettings] = React.useState<SettingProps>({
    apiKey: '', // replace with your default apiKey value
  temperature: 0, // replace with your default temperature value
  model: '', 
  });

  useEffect(() => {
    async function fetchSettings() {
      const settings = await IndexedDBHelper.getSettings();
      setSettings(settings);
    }

      fetchSettings();
  });

  return (

    <SettingsContext.Provider value={{ openSettings, setSettingsOpen, settings }}>
      <CssVarsProvider disableTransitionOnChange defaultMode="dark">
        <CssBaseline />
        <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
          {/*<Sidebar />*/}
          <Header />
          <Box component="main" className="MainContent" sx={{ flex: 1 }}>
            <MyDbMessages  />
            <ToastContainer />
            <Settings settings={settings}/>
          </Box>
        </Box>
      </CssVarsProvider>
    </SettingsContext.Provider>
  );
}
