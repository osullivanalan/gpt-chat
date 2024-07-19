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

  useEffect(() => {
    const loadChats = async () => {
      const loadedChats = await IndexedDBHelper.getAllChats();
      setChats(loadedChats);
      if (loadedChats.length > 0) {
        setSelectedChat(loadedChats[loadedChats.length-1]);
      }
    };

    loadChats();
  }, []);

  const handleNewMessage = useCallback(async (content: string) => {
    if (!selectedChat) return;

    const newMessage: MessageProps = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toISOString(),
      sender: { name: 'You' },
    };

    let updatedChat: ChatProps = {
      ...selectedChat,
      messages: [...selectedChat.messages, newMessage],
    };

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

    setSelectedChat(prevChat => {
      if (!prevChat) return prevChat;
      const newMessages = [...prevChat.messages, gptMessage];
      updatedChat = { ...updatedChat, messages: newMessages };  // Sync the interim state
      return { ...prevChat, messages: newMessages };
    });

    for await (const chunk of stream) {
      const chunkContent = chunk.choices[0]?.delta?.content || '';

      for (const char of chunkContent) {
        gptResponse += char;

        setSelectedChat(prevChat => {
          if (!prevChat) return prevChat;
          const updatedMessages = prevChat.messages.map(message =>
            message.id === gptMessage.id ? { ...message, content: gptResponse } : message
          );
          updatedChat = { ...updatedChat, messages: updatedMessages };  // Sync the interim state
          return { ...prevChat, messages: updatedMessages };
        });

        await new Promise(resolve => setTimeout(resolve, 20));  // delay for each character
      }

      if (chunk.choices[0]?.finish_reason === "stop") {
        const finalUpdatedChat = {
          ...updatedChat,
          messages: updatedChat.messages.map(message =>
            message.id === gptMessage.id ? { ...message, content: gptResponse } : message
          )
        };

        await IndexedDBHelper.updateChat(finalUpdatedChat);
        setChats(chats => 
          chats.map(chat => chat.id === updatedChat.id ? finalUpdatedChat : chat)
        );
      }
    }

    // Final update to ensure the message is saved to the DB
    const finalUpdatedChat = {
      ...updatedChat,
      messages: updatedChat.messages.map(message =>
        message.id === gptMessage.id ? { ...message, content: gptResponse } : message
      )
    };

    await IndexedDBHelper.updateChat(finalUpdatedChat);
    setChats(chats => 
      chats.map(chat => chat.id === updatedChat.id ? finalUpdatedChat : chat)
    );

  }, [selectedChat]);

  if (!selectedChat) return null;

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
          //top: 52, //to allow for the header
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