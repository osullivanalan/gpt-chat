import * as React from 'react';
import Sheet from '@mui/joy/Sheet';

import MessagesPane from './MessagesPane';
import ChatsPane from './ChatsPane';
import { ChatProps, MessageProps } from '../types';
import { chats } from '../data';
import IndexedDBHelper from '../IndexedDBHelper';
import { ChatGPTAPI } from '../ChatGPTAPI';

export default function MyProfile() {
  
  const [chats, setChats] = React.useState<Array<ChatProps>>([]);
  const [selectedChat, setSelectedChat] = React.useState<ChatProps>(chats[0]);
  const [message, setMessage] = React.useState('');

  const handleNewMessage = async (content: string) => {
    if (!selectedChat) return;
  
    const newMessage: MessageProps = {
      id: Date.now().toString(), // Generate a unique ID for the new message
      content,
      timestamp: new Date().toISOString(),
      sender: {name: 'You'},
    };
  
    // Update the selected chat with the new message
    const updatedChat: ChatProps = {
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
    };
  
    // Update the chat in the IndexedDB
    await IndexedDBHelper.updateChat(updatedChat);
  
    // Make a request to the Chat GPT API with the chat history
    const gptResponse = await ChatGPTAPI.getReply(updatedChat.messages);
  
    // Add the GPT response to the chat
    const gptMessage: MessageProps = {
      id: Date.now().toString(), // Generate a unique ID for the GPT message
      content: gptResponse,
      timestamp: new Date().toISOString(),
      sender: {name: 'GPT'},
    };
  
    updatedChat.messages.push(gptMessage);
  
    // Update the chat in the IndexedDB again with the GPT message
    await IndexedDBHelper.updateChat(updatedChat);
  
    // Update the local state
    setSelectedChat(updatedChat);
    // Update the chats state
    setChats(chats.map(chat => chat.id === updatedChat.id ? updatedChat : chat));
  };
  

  return (
    <Sheet
      sx={{
        flex: 1,
        width: '100%',
        mx: 'auto',
        pt: { xs: 'var(--Header-height)', sm: 0 },
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'minmax(min-content, min(30%, 400px)) 1fr',
        },
      }}
    >
      <Sheet
        sx={{
          position: { xs: 'fixed', sm: 'sticky' },
          transform: {
            xs: 'translateX(calc(100% * (var(--MessagesPane-slideIn, 0) - 1)))',
            sm: 'none',
          },
          transition: 'transform 0.4s, width 0.4s',
          zIndex: 100,
          width: '100%',
          top: 52,
        }}
      >
        <ChatsPane
          chats={chats}
          setChats={setChats}
          selectedChatId={selectedChat.id}
          setSelectedChat={setSelectedChat}
        />
      </Sheet>
      <MessagesPane chat={selectedChat} handleNewMessage={handleNewMessage} />
    </Sheet>
  );
}
