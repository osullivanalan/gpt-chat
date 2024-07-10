import * as React from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
//import AvatarWithStatus from './AvatarWithStatus';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import MessageItem from './MessageItem';
import MessagesPaneHeader from './MessagesPaneHeader';
import { ChatProps, MessageProps } from '../types';
import { formatDateTimeString } from '../utils';

type MessagesPaneProps = {
  chat: ChatProps;
  handleNewMessage: (message: string) => void;
};



export default function MessagesPane(props: MessagesPaneProps) {
  const { chat, handleNewMessage } = props;
  const [chatMessages, setChatMessages] = React.useState(chat.messages);
  const [textAreaValue, setTextAreaValue] = React.useState('');

  const [previewMessage, setPreviewMessage] = React.useState('');

  const previewMessageProps: MessageProps = {
    id: 'preview',
    content: previewMessage,
    timestamp: formatDateTimeString(new Date().toISOString()),
    sender: {
      name: 'You',  // Replace with the actual user's name
      // Add more properties as needed
    },
    // Add more properties as needed
  };

  React.useEffect(() => {
    setChatMessages(chat.messages);
  }, [chat.messages]);

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
          flexDirection: 'column-reverse',
        }}
      >
        <Stack spacing={2} justifyContent="flex-end">

          {chatMessages.map((message: MessageProps) => (
            <MessageItem key={message.id} message={message} />
          ))}


          {/* as user is typing display the preview 
          {previewMessage && (
            <Stack
              justifyContent="flex-end"
              direction="row"
              spacing={2}
              flexDirection='row'
            >
              <ChatBubble variant='sent'  {...previewMessageProps} />
            </Stack>
          )}
            */}
        </Stack>
      </Box>

      <MessageInput
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
        handleNewMessage={handleNewMessage}

      />
    </Sheet>
  );
}
