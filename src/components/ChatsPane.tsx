import * as React from 'react';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import { Box, Chip, IconButton, Input, ListDivider } from '@mui/joy';
import List from '@mui/joy/List';

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ChatListItem from './ChatListItem';
import { ChatProps, ChatsPaneProps, MessageProps } from '../types';
import { toggleMessagesPane } from '../utils';
import IndexedDBHelper from '../IndexedDBHelper';
import SettingsMenu from './SettingsMenu';

export default function ChatsPane(props: ChatsPaneProps) {

  const { chats, setChats, setSelectedChat, selectedChatId } = props;

  const deleteChat = async (chatId: string) => {
    // Delete the chat from the database
    await IndexedDBHelper.deleteChat(chatId);
  
    // Remove the chat from the list of chats
    const updatedChats = chats.filter(chat => chat.id !== chatId);
  
    setChats(updatedChats);
  };

  return (
    <Sheet
      sx={{
        borderRight: '1px solid',
        borderColor: 'divider',
        //height: 'calc(100dvh - var(--Header-height))',
        height: '100dvh',
        overflowY: 'scroll',
        display: 'flex', // make this a flex container
        flexDirection: 'column', // arrange children in a column
        justifyContent: 'space-between', // separate the top and bottom content

      }}
    >

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        p={2}
        pb={1.5}
      >
        <Typography
          fontSize={{ xs: 'md', md: 'lg' }}
          component="h1"
          fontWeight="lg"
          endDecorator={
            <Chip
              variant="soft"
              color="primary"
              size="md"
              slotProps={{ root: { component: 'span' } }}
            >
              {chats.length}
            </Chip>
          }
          sx={{ mr: 'auto' }}
        >
          Conversations
        </Typography>
       
        <IconButton
          variant="plain"
          aria-label="edit"
          color="neutral"
          size="sm"
          onClick={() => {
            toggleMessagesPane();
          }}
          sx={{ display: { sm: 'none' } }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Stack>
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Input
          size="sm"
          startDecorator={<SearchRoundedIcon />}
          placeholder="Search"
          aria-label="Search"
        />
      </Box>
      <List
        sx={{
          py: 0,
          '--ListItem-paddingY': '0.75rem',
          '--ListItem-paddingX': '1rem',
          overflowY: 'auto'
        }}
      >
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            {...chat}
            setSelectedChat={setSelectedChat}
            selectedChatId={selectedChatId}
            deleteChat={deleteChat} // pass the deleteChat function
          />
        ))}
      </List>
      
      <SettingsMenu {...props} />
    
    </Sheet>
  );
}
