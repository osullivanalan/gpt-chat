import React, { useContext, useEffect, useState } from 'react';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import { Checkbox, FormHelperText, Sheet, Slider, Typography } from '@mui/joy';
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

import CloseIcon from '@mui/icons-material/Close';

import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';

import IndexedDBHelper from '../IndexedDBHelper'; // Adjust the path as needed

import ModelSelector from './ModelSelector';
import { SettingsContext } from '../contexts/SettingsContext';
import { SettingProps } from '../types';
import { DefaultGptModelSettings } from '../utils/consts';

export default function Settings() {

    const settingsContext = useContext(SettingsContext);

    if (!settingsContext) {
        throw new Error('Settings must be used within a SettingsProvider');
    }

    const { openSettings, setSettingsOpen, settings, setSettings } = settingsContext;

    const decimalMarks = [];

    for (let i = 1; i <= 10; i++) {
        const value = (i / 10).toFixed(1); // This gives you a value of 0.1 to 1.0
        decimalMarks.push({
            value: parseFloat(value),  // Convert to float
            label: value,
        });
    }

    useEffect(() => {
        const saveSettings = async () => {
            if (settings) {
                console.log(`Setting saved: ${JSON.stringify(settings)}`);
                await IndexedDBHelper.setSettings(settings);
            }
        };
        // Call saveSettings when settings updates
        saveSettings();
    }, [settings]); // This effect runs every time the settings change


    async function resetSettings() {
        console.log("reset to defaults");
        setSettings(DefaultGptModelSettings);
        console.log(`resetSettings ${JSON.stringify(DefaultGptModelSettings)}`);
    }

    // Common function to update settings
    async function updateSettings(name: string, value: any) {
        console.log(`Udpate setting ${name} to ${value}`);
        setSettings((prevState) =>
            prevState
                ? { ...prevState, [name]: value } as SettingProps
                : { [name]: value } as SettingProps
        );
    }

    // Generic input change handler
    async function handleInputChange(event: { target: { name: string; type: string; checked: boolean; value: string; }; }) {
        const { name, type, value, checked } = event.target;
        const newValue = type === 'checkbox' ? checked : value;
        updateSettings(name, newValue);

    };

    // Slider change handler (generic)
    function handleSliderChange(name: string) {
        return (event: Event, newValue: number | number[]) => {
            updateSettings(name, newValue);
        };
    }


    return (
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={openSettings}
            onClose={() => setSettingsOpen(false)}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'auto',

            }}
        >
            <Sheet
                variant="outlined"
                sx={{
                    borderRadius: 'md',
                    p: 3,
                    boxShadow: 'lg',
                    width: { md: '50%' }
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

                            <Stack
                                direction="row"
                                spacing={3}
                                sx={{ display: { xs: 'flex', md: 'flex' }, my: 1 }}
                            >
                                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                                    <Stack spacing={1}>
                                        <FormLabel>API Key</FormLabel>
                                        <FormControl
                                            sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                                        >
                                            <Input name="apiKey" size="sm" placeholder="API Key" value={settings?.apiKey} onChange={handleInputChange} />

                                        </FormControl>
                                        <FormLabel>Model</FormLabel>
                                        <ModelSelector value={settings?.model} onChange={handleInputChange}></ModelSelector>

                                        <Divider />

                                        <FormLabel>Temperature</FormLabel>
                                        <FormHelperText>Larger value produces more random output</FormHelperText>
                                        <FormControl
                                            sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                                        >
                                            <Slider
                                                aria-label="Temperature"
                                                name="temperature"
                                                defaultValue={0.5}
                                                value={settings?.temperature}
                                                max={1}
                                                getAriaValueText={(value, index) => { return `${value}` }}
                                                step={0.1}
                                                marks={decimalMarks}
                                                valueLabelDisplay="on"
                                                onChange={handleSliderChange("temperature")}
                                            />


                                        </FormControl>
                                        <FormLabel>Top-P</FormLabel>
                                        <FormHelperText>Do not aler this with temperature</FormHelperText>
                                        <FormControl
                                            sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                                        >
                                            <Slider
                                                aria-label="Top-P"
                                                name="topp"
                                                defaultValue={1.0}
                                                value={settings?.topp}
                                                max={1}
                                                getAriaValueText={(value, index) => { return `${value}` }}
                                                step={0.1}
                                                marks={decimalMarks}
                                                valueLabelDisplay="on"
                                                onChange={handleSliderChange("topp")}
                                            />


                                        </FormControl>

                                        <FormLabel>Max Tokens</FormLabel>
                                        <FormHelperText>Maximum length of input tokens and generated tokens</FormHelperText>
                                        <FormControl
                                            sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                                        >
                                            <Input
                                                name="maxtokens"
                                                size="sm"
                                                placeholder=""
                                                value={settings?.maxtokens}
                                                onChange={handleInputChange} />

                                        </FormControl>
                                        <FormLabel>Presence Penalty</FormLabel>
                                        <FormHelperText>Larger value increases likelihood of new topics</FormHelperText>
                                        <FormControl
                                            sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                                        >
                                            <Input
                                                name="presencePenalty"
                                                size="sm"
                                                placeholder=""

                                                value={settings?.presencePenalty} onChange={handleInputChange} />

                                        </FormControl>
                                        <FormLabel>Presence Penalty</FormLabel>
                                        <FormHelperText>Larger value decreases likelihood of repeated responses</FormHelperText>
                                        <FormControl
                                            sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                                        >
                                            <Input
                                                name="frequencePenalty"
                                                size="sm"
                                                placeholder=""
                                                value={settings?.frequencyPenalty}
                                                onChange={handleInputChange} />

                                        </FormControl>
                                        <FormLabel>History Compression</FormLabel>
                                        <FormHelperText>Compress if uncompressed messages length is exceeded</FormHelperText>
                                        <FormControl
                                            sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                                        >
                                            <Input
                                                name="historyCompression"
                                                size="sm"
                                                placeholder=""
                                                value={settings?.historyCompression}
                                                onChange={handleInputChange} />

                                        </FormControl>

                                        <FormLabel>Send Memory</FormLabel>
                                        <FormHelperText>Send conversation memory</FormHelperText>
                                        <FormControl
                                            sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                                        >
                                            <Checkbox
                                                name="sendMemory"
                                                checked={settings?.sendMemory == true ? true : false}
                                                onChange={handleInputChange}
                                            />

                                        </FormControl>


                                    </Stack>

                                </Stack>
                            </Stack>

                            <CardActions sx={{ display: 'flex', pt: 2 }}>
                                <IconButton
                                    variant="plain"
                                    aria-label="Close"
                                    color="neutral"
                                    size="sm"
                                    onClick={() => { setSettingsOpen(false) }}
                                >
                                    <CloseIcon />
                                </IconButton>

                                <Box sx={{ ml: 'auto' }}>
                                    <Button
                                        size="sm"
                                        variant="solid"
                                        onClick={() => { resetSettings() }}
                                    >
                                        Defaults
                                    </Button>
                                </Box>
                            </CardActions>
                        </Card>
                    </Stack>
                </Box>
            </Sheet>
        </Modal>
    )
}
