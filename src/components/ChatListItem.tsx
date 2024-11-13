import * as React from 'react';
import Box from '@mui/joy/Box';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import CircleIcon from '@mui/icons-material/Circle';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { ChatListItemProps} from '../types';
import { toggleMessagesPane, formatDateTimeString } from '../utils';
import { useState } from 'react';

export default function ChatListItem(props: ChatListItemProps) {
  const { id, sender, messages, selectedChatId, setSelectedChat, deleteChat } = props;
  const selected = selectedChatId === id;
  const [isHovered, setIsHovered] = useState(false);
  return (
    <React.Fragment>
      <ListItem
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ListItemButton
          onClick={() => {
            toggleMessagesPane();
            setSelectedChat({ id, sender, messages });
          }}
          selected={selected}
          color="neutral"
          sx={{
            flexDirection: 'column',
            alignItems: 'initial',
            gap: 1,
          }}
        >
          <Stack direction="row" spacing={1.5}>
            {/*<AvatarWithStatus online={sender.online} src={sender.avatar} /> */}
            <Box sx={{ flex: 1 }}>
              <Typography level="title-sm">{sender.name} {messages.length} Messages</Typography>
              {/*<Typography level="body-sm">{sender.username}</Typography>*/}

            </Box>
            <Box
              sx={{
                lineHeight: 1.5,
                textAlign: 'right',
              }}
            >
              {messages[0].unread && (
                <CircleIcon sx={{ fontSize: 12 }} color="primary" />
              )}
              <Typography
                level="body-xs"
                display={{ xs: 'none', md: 'block' }}
                noWrap
              >
                {formatDateTimeString(messages[messages.length - 1].timestamp)}
              </Typography>
            </Box>

          </Stack>
          <Typography
            level="body-sm"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: {
                sm: '300px', 
                md: '300px', 
                lg: '300px', 
                xl: '300px', 
              },
            }}
          >
            {
              messages[1]?.content //assumes 2nd message is from You
            }
          </Typography>

          {isHovered && (
            <CloseRounded
              sx={{
                position: 'absolute',
                bottom: 2, // adjust as needed
                right: 8, // adjust as needed
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.stopPropagation(); // to prevent triggering the ListItemButton's onClick
                deleteChat(id);
              }}
            />
          )}

        </ListItemButton>
      </ListItem>
      <ListDivider sx={{ margin: 0 }} />
    </React.Fragment>
  );
}
