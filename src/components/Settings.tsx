import React, { useEffect, useState } from 'react';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import { Sheet, Typography } from '@mui/joy';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import Textarea from '@mui/joy/Textarea';
import Stack from '@mui/joy/Stack';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';

import IndexedDBHelper from '../IndexedDBHelper'; // Adjust the path as needed
import { SettingsContext } from '../contexts/SettingsContext'; // Adjust the path as needed
import ModelSelector from './ModelSelector';


export default function Settings({settings}) {
    const settingsContext = React.useContext(SettingsContext);
    if (!settingsContext) {
        throw new Error("Settings must be used within a SettingsContext.Provider");
    }
    const { openSettings, setSettingsOpen } = settingsContext;
    const [apiKey, setApiKey] = useState('');
    const [temperature, setTemperature] = useState(0);
    const [model, setModel] = useState('');

    setApiKey(settings.apiKey);
    setTemperature(settings.temperature);
    setModel(settings.model);

    async function saveSettings() {
        console.log(`Setting key, temp and model ${model}`);
        await IndexedDBHelper.setSettings(apiKey, temperature, model);
        setSettingsOpen(false);
    }

    const handleModelChange = (
        event: React.SyntheticEvent | null,
        newValue: string,
      ) => {
        //alert(`You chose "${newValue}"`);
        setModel(newValue);
        //console.log(`Model change is: ${model}`);
      };

    return (
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={openSettings}
            onClose={() => setSettingsOpen(false)}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
            <Sheet
                variant="outlined"
                sx={{
                    maxWidth: 800,
                    borderRadius: 'md',
                    p: 3,
                    boxShadow: 'lg',
                }}
            >
                <ModalClose variant="plain" sx={{ m: 1 }} />

                <Box sx={{ flex: 1, width: '100%' }}>

                    <Box sx={{ px: { xs: 2, md: 6 } }}>
                        <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
                            Settings
                        </Typography>
                    </Box>

                    <Stack
                        spacing={4}
                        sx={{
                            display: 'flex',
                            maxWidth: '800px',
                            mx: 'auto',
                            px: { xs: 2, md: 6 },
                            py: { xs: 2, md: 3 },
                        }}
                    >
                        <Card>
                            <Box sx={{ mb: 1 }}>
                                <Typography level="title-md">GTP Settings</Typography>
                                <Typography level="body-sm">
                                    Specific GTP level settings, model etc...
                                </Typography>
                            </Box>
                            <Divider />
                            <Stack
                                direction="row"
                                spacing={3}
                                sx={{ display: { xs: 'none', md: 'flex' }, my: 1 }}
                            >
                                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                                    <Stack spacing={1}>
                                        <FormLabel>API Key</FormLabel>
                                        <FormControl
                                            sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                                        >
                                            <Input size="sm" placeholder="API Key" value={apiKey} onChange={e => setApiKey(e.target.value)} />

                                        </FormControl>
                                        <FormLabel>Temperature</FormLabel>
                                        <FormControl
                                            sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                                        >
                                            <Input size="sm" placeholder="Temperature" value={temperature} onChange={e => setTemperature(Number(e.target.value))} />

                                        </FormControl>
                                        <FormLabel>Model</FormLabel>
                                        <ModelSelector value={model} onChange={handleModelChange}></ModelSelector>
                                    </Stack>

                                </Stack>
                            </Stack>

                            <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>

                                <Button size="sm" variant="solid" onClick={saveSettings}>
                                    Save
                                </Button>
                            </CardActions>

                        </Card>
                    </Stack>
                </Box>
            </Sheet>
        </Modal>
    )
}
