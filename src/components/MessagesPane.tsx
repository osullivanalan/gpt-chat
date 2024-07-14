import * as React from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import MessageInput from './MessageInput';
import MessageItem from './MessageItem';
import MessagesPaneHeader from './MessagesPaneHeader';
import { ChatProps, MessageProps } from '../types';

type MessagesPaneProps = {
  chat: ChatProps;
  handleNewMessage: (message: string) => void;
};

const MessagesPane: React.FC<MessagesPaneProps> = ({ chat, handleNewMessage }) => {
  const [chatMessages, setChatMessages] = React.useState<MessageProps[]>(chat.messages);
  const [textAreaValue, setTextAreaValue] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    setChatMessages(chat.messages);
  }, [chat.messages]);

  React.useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  };

  const handleNewMessageCallback = React.useCallback(
    (message: string) => {
      handleNewMessage(message);
    },
    [handleNewMessage]
  );

  return (
    <Sheet
      sx={{
        height: { xs: 'calc(100dvh - var(--Header-height))', lg: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.level1',
      }}
    >
      <MessagesPaneHeader sender={chat.sender} />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: 'scroll',
          flexDirection: 'column',
        }}
      >
        <Stack spacing={2} justifyContent="flex-end">
          {chatMessages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef}></div>
        </Stack>
      </Box>

      <MessageInput
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
        handleNewMessage={handleNewMessageCallback}
      />
    </Sheet>
  );
};

export default MessagesPane;