import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import Sheet from '@mui/joy/Sheet';

import MessagesPane from './MessagesPane';
import ChatsPane from './ChatsPane';
import { ChatProps, MessageProps } from '../types';
import IndexedDBHelper from '../IndexedDBHelper';
import { ChatGPTAPI } from '../ChatGPTAPI';

const MyProfile: React.FC = React.memo(() => {
  const [chats, setChats] = useState<ChatProps[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatProps | null>(null);

  // Effect to load chats initially
  useEffect(() => {
    const loadChats = async () => {
      const loadedChats = await IndexedDBHelper.getAllChats();
      setChats(loadedChats);
      if (loadedChats.length > 0) {
        setSelectedChat(loadedChats[0]);
      }
    };

    loadChats();
  }, []);

  // Memoized callback for adding a new message
  const handleNewMessage = useCallback(async (content: string) => {
    if (!selectedChat) return; // Bail out if selectedChat is not available

    const newMessage: MessageProps = {
      id: Date.now().toString(), // Generate a unique ID for the new message
      content,
      timestamp: new Date().toISOString(),
      sender: { name: 'You' },
    };

    // Update the selected chat with the new message
    const updatedChat: ChatProps = {
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
    };

    // Update the chat in the IndexedDB
    await IndexedDBHelper.updateChat(updatedChat);
    
    setSelectedChat(updatedChat);

    const stream = await ChatGPTAPI.getReply(updatedChat.messages);

    let gptResponse = '';
    let gptMessage: MessageProps = {
      id: Date.now().toString(),
      content: gptResponse,
      timestamp: new Date().toISOString(),
      sender: { name: 'GPT' }
    };

    // Append the initial GPT message to the updated chat
    setSelectedChat(prevChat => {
      if (!prevChat) return prevChat;
      const newMessages = [...prevChat.messages, gptMessage];
      return { ...prevChat, messages: newMessages };
    });
    

    for await (const chunk of stream) {
      gptResponse += (chunk.choices[0]?.delta?.content || '');
      setSelectedChat(prevChat => {
        if (!prevChat) return prevChat;
        const updatedMessages = prevChat.messages.map(message =>
          message.id === gptMessage.id ? { ...message, content: gptResponse } : message
        );
        const updatedChat = { ...prevChat, messages: updatedMessages };
        
        if (chunk.choices[0]?.finish_reason === "stop") {
          IndexedDBHelper.updateChat(updatedChat).then(() => {
            setChats(chats => chats.map(chat => chat.id === updatedChat.id ? { ...updatedChat, messages: [...updatedChat.messages] } : chat));
          });
        }
        return { ...prevChat, messages: updatedMessages };
      });
    }
  }, [selectedChat]);

  

  // If no chat is selected, render nothing or a loading state
  if (!selectedChat) {
    return null; // or a loading indicator
  }

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
          selectedChatId={selectedChat.id}
          setSelectedChat={setSelectedChat}
          setChats={setChats}
        />
      </Sheet>
      <MessagesPane chat={selectedChat} handleNewMessage={handleNewMessage} />
    </Sheet>
  );
});

export default MyProfile;