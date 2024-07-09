import * as React from 'react';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import { Box, Chip, IconButton, Input } from '@mui/joy';
import List from '@mui/joy/List';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ChatListItem from './ChatListItem';
import { ChatProps, MessageProps } from '../types';
import { toggleMessagesPane } from '../utils';
import IndexedDBHelper from '../IndexedDBHelper';

type ChatsPaneProps = {
  chats: ChatProps[];
  setSelectedChat: (chat: ChatProps) => void;
  setChats: (chats: ChatProps[]) => void;
  selectedChatId: string;
};


export default function ChatsPane(props: ChatsPaneProps) {
  
  const { chats, setChats, setSelectedChat, selectedChatId } = props;
  
  const addNewChat = async (newChat: ChatProps) => {
    // Add the new chat to the list of chats
    const updatedChats = [...chats, newChat];
    
    setChats(updatedChats);
    // Add the new chat to the database
    await IndexedDBHelper.addChat(newChat);
  };
  

  const createNewMesssageThread = async () => {
    const newMessage : MessageProps = {
      id: Date.now().toString(),
      content: "How can I help?",
      timestamp: new Date().toISOString(),
      sender:{
        name:'GPT'
      },
    };
  
    const newChat: ChatProps = {
      id: Date.now().toString(),
      messages: [newMessage],
      sender: {
        name:'GPT'
      }
      // Add any other necessary properties here
    };

    addNewChat(newChat);
    setSelectedChat(newChat);
  }


  return (
    <Sheet
      sx={{
        borderRight: '1px solid',
        borderColor: 'divider',
        height: 'calc(100dvh - var(--Header-height))',
        overflowY: 'scroll',
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
          Conversation Threads
        </Typography>
        <IconButton
          variant="plain"
          aria-label="edit"
          color="neutral"
          size="sm"
          onClick={() => {
            createNewMesssageThread();
          }}
          sx={{ display: { xs: 'none', sm: 'unset' } }}
        >
          <EditNoteRoundedIcon />
        </IconButton>
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
        }}
      >
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            {...chat}
            setSelectedChat={setSelectedChat}
            selectedChatId={selectedChatId}
          />
        ))}
      </List>

      
    </Sheet>
  );
}
