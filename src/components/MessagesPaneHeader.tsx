import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import CircleIcon from '@mui/icons-material/Circle';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import SettingsApplicationsRounded from '@mui/icons-material/SettingsApplicationsRounded';

import gptLogo from '../contexts/openailogo.png'

import { UserProps } from '../types';
import { toggleMessagesPane } from '../utils';
import { useContext, useState } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
type MessagesPaneHeaderProps = {
  sender: UserProps;
};

export default function MessagesPaneHeader(props: MessagesPaneHeaderProps) {
  const { sender } = props;

  const settingsContext = useContext(SettingsContext);

  if (!settingsContext) {
    throw new Error('Settings must be used within a SettingsProvider');
  }

  const { settings } = settingsContext;
  
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        position: {xs: 'sticky', md: 'relative'},
        top: {xs: 0, md: 'auto'},
        zIndex: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.body',
      }}
      py={{ xs: 2, md: 2 }}
      px={{ xs: 1, md: 2 }}
    >
      <Stack direction="row" spacing={{ xs: 1, md: 2 }} alignItems="center">
        <IconButton
          variant="plain"
          color="neutral"
          size="sm"
          sx={{
            display: { xs: 'inline-flex', sm: 'none' },
          }}
          onClick={() => toggleMessagesPane()}
        >
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
        <Avatar size="lg" src={gptLogo} />
        <div>
          <Typography
            fontWeight="lg"
            fontSize="lg"
            component="h2"
            noWrap
            endDecorator={
              sender.online ? (
                <Chip
                  variant="outlined"
                  size="sm"
                  color="neutral"
                  sx={{
                    borderRadius: 'sm',
                  }}
                  startDecorator={
                    <CircleIcon sx={{ fontSize: 8 }} color="success" />
                  }
                  slotProps={{ root: { component: 'span' } }}
                >
                  Online
                </Chip>
              ) : undefined
            }
          >
            {sender.name}
          </Typography>
          <Typography level="body-sm">Model: {settings?.model}</Typography>
        </div>
      </Stack>
     

    </Stack>
  );
}
