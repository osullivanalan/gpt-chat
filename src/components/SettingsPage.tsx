import React, { useContext, useEffect, useState } from 'react';
import ModalClose from '@mui/joy/ModalClose';
import { Sheet, Typography } from '@mui/joy';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import IndexedDBHelper from '../IndexedDBHelper'; // Adjust the path as needed
import ModelSelector from './ModelSelector';
import { SettingsContext } from '../contexts/SettingsContext';
import { SettingProps } from '../types';

export default function SettingsPage() {

    const settingsContext = useContext(SettingsContext);

    if (!settingsContext) {
        throw new Error('Settings must be used within a SettingsProvider');
    }

    const { openSettings, setSettingsOpen, settings, setSettings } = settingsContext;

    async function saveSettings() {
        if (settings) {
            await IndexedDBHelper.setSettings(settings);
            setSettingsOpen(false);
        }
    }

    function handleInputChange(event: { target: { name: any; value: any; }; }) {
        const { name, value } = event.target;
        //console.log(`name: ${name} value ${value}`);
        setSettings((prevState) =>
            prevState
                ? { ...prevState, [name]: value } as SettingProps
                : { [name]: value } as SettingProps
        );

    }

    return (
        <Box sx={{ flex: 1, width: '100%' }}>
            <Box
                sx={{
                    position: 'sticky',
                    top: { sm: -100, md: -110 },
                    bgcolor: 'background.body',
                    zIndex: 9995,
                }}
            >
                <Box sx={{ px: { xs: 2, md: 6 } }}>

                    <Typography level="h2" component="h1" sx={{ mt: 1, mb: 2 }}>
                        My profile
                    </Typography>
                </Box>
            </Box>
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
                                            <Input name="apiKey" size="sm" placeholder="API Key" value={settings?.apiKey} onChange={handleInputChange} />

                                        </FormControl>
                                        <FormLabel>Temperature</FormLabel>
                                        <FormControl
                                            sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                                        >
                                            <Input name="temperature" size="sm" placeholder="Temperature" value={settings?.temperature} onChange={handleInputChange} />

                                        </FormControl>
                                        <FormLabel>Model</FormLabel>
                                        <ModelSelector value={settings?.model} onChange={handleInputChange}></ModelSelector>
                                    </Stack>

                                </Stack>
                            </Stack>

                            <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>

                                <Button size="sm" variant="solid" onClick={() => { saveSettings() }}>
                                    Save
                                </Button>
                            </CardActions>

                        </Card>
                    </Stack>
                </Box>
            </Sheet>
        </Box>
    )
}
