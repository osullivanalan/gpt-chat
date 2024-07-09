import * as React from 'react';
import { useEffect, useState } from 'react';
import Sheet from '@mui/joy/Sheet';

import MessagesPane from './MessagesPane';
import ChatsPane from './ChatsPane';
import { ChatProps, MessageProps } from '../types';
import IndexedDBHelper from '../IndexedDBHelper';
import { ChatGPTAPI } from '../ChatGPTAPI';

export default function MyProfile() {
  const [chats, setChats] = useState<ChatProps[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatProps | null>(null);

  useEffect(() => {
    const loadChats = async () => {
      const loadedChats = await IndexedDBHelper.getAllChats();
      setChats(loadedChats);
      setSelectedChat(loadedChats[0]);
    };

    loadChats();
  }, []);

  if (!selectedChat) {
    return null; // or a loading indicator
  }



  const handleNewMessage = async (content: string) => {
    if (!selectedChat) return;

    const newMessage: MessageProps = {
      id: Date.now().toString(), // Generate a unique ID for the new message
      content,
      timestamp: new Date().toISOString(),
      sender: {
        name: 'You'
      },
    };

    // Update the selected chat with the new message
    const updatedChat: ChatProps = {
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
    };

    // Update the chat in the IndexedDB
    await IndexedDBHelper.updateChat(updatedChat);

    setSelectedChat(updatedChat); //display the question

    // Make a request to the Chat GPT API with the chat history
    //const gptResponse = await ChatGPTAPI.getReply(updatedChat.messages);

    const stream = await ChatGPTAPI.getReply(updatedChat.messages);

    let gptResponse = '';
    let gptMessage: MessageProps = {
      id: Date.now().toString(),
      content: gptResponse,
      timestamp: new Date().toISOString(),
      sender: {
        name: 'GPT'
      },
    };

    updatedChat.messages.push(gptMessage);

    for await (const chunk of stream) {
      gptResponse += chunk.choices[0]?.delta?.content || '';
      gptMessage.content = gptResponse;
  
      setSelectedChat({...updatedChat});
  
      if (chunk.choices[0]?.finish_reason === "stop") { //hacky??
        await IndexedDBHelper.updateChat(updatedChat);
        setChats(chats.map(chat => chat.id === updatedChat.id ? updatedChat : chat));
      }
    }

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
          selectedChatId={selectedChat.id}
          setSelectedChat={setSelectedChat}
          setChats={setChats}
        />
      </Sheet>
      <MessagesPane chat={selectedChat} handleNewMessage={handleNewMessage} />
    </Sheet>
  );
}
