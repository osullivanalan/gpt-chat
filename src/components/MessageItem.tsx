import { Stack } from "@mui/joy";
import React from "react";
import { MessageProps } from "../types";
import ChatBubble from "./ChatBubble";

export const MessageItem: React.FC<{ message: MessageProps }> = React.memo(({ message }) => {
  const isYou = message.sender.name === 'You';
  return (
    <Stack
      key={message.id}
      direction="row"
      spacing={2}
      flexDirection={isYou ? 'row-reverse' : 'row'}
    >
      <ChatBubble variant={isYou ? 'sent' : 'received'} {...message} />
    </Stack>
  );
}, (prevProps, nextProps) => {
  // This custom comparison function checks if the message ID or content has changed
  return prevProps.message.id === nextProps.message.id && prevProps.message.content === nextProps.message.content;
});

export default MessageItem;