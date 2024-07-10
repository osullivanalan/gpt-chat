import { Stack } from "@mui/joy";
import React from "react";
import { MessageProps } from "../types";
import ChatBubble from "./ChatBubble";

export default function MessageItem({ message }: { message: MessageProps }) {
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
  }