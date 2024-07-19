import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
//import Header from './components/Header';
import MyDbMessages from './components/MyDbMessages';
import { ToastContainer } from 'react-toastify';
import SettingsModal from './components/SettingsModal';
import { SettingsProvider } from './contexts/SettingsProvider'
import './index.css';

export default function App() {

  return (
    <SettingsProvider>
      <CssVarsProvider disableTransitionOnChange defaultMode="dark">
        <CssBaseline />
        <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
          {/*<Sidebar /> */}
          {/*  <Header /> */}
          <Box component="main" className="MainContent" sx={{ flex: 1 }}>
            <MyDbMessages />
            <ToastContainer />
            <SettingsModal />
          </Box>
        </Box>
      </CssVarsProvider>
    </SettingsProvider>
  );
}
