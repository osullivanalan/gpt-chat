import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import CopyToClipBoardIcon from '@mui/icons-material/CopyAll';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import { MessageProps } from '../types';
import { formatDateTimeString } from '../utils';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight, gruvboxDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import { useColorScheme } from '@mui/joy/styles';

type ChatBubbleProps = MessageProps & {
  variant: 'sent' | 'received';
};

const ChatBubble: React.FC<ChatBubbleProps> = React.memo((props: ChatBubbleProps) => {
 
  const { content, variant, timestamp, attachment = undefined, sender } = props;
  const isSent = variant === 'sent';
  const [isHovered, setIsHovered] = React.useState<boolean>(false);
  const { mode, setMode } = useColorScheme();

  const syntaxComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '')
      return !inline && match
        ? <SyntaxHighlighter 
        style={mode === 'dark' ? gruvboxDark : solarizedlight}
        language={match[1]} 
        PreTag="div" 
        children={String(children).replace(/\n$/, '')} {...props} />
        : <code className={className} {...props}>{children}</code>
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Text copied to clipboard'); // Show success toast
    } catch (err) {
      toast.error('Failed to copy text'); // Show error toast
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Box sx={{ maxWidth: '80%', minWidth: 'auto' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 0.25 }}
      >
        <Typography level="body-xs">
          {sender.name}
        </Typography>
        <Typography level="body-xs">{formatDateTimeString(timestamp)}</Typography>
      </Stack>
      {attachment ? (
        <Sheet
          variant="outlined"
          sx={{
            px: 1.75,
            py: 1.25,
            borderRadius: 'lg',
            borderTopRightRadius: isSent ? 0 : 'lg',
            borderTopLeftRadius: isSent ? 'lg' : 0,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar color="primary" size="lg">
              <InsertDriveFileRoundedIcon />
            </Avatar>
            <div>
              <Typography fontSize="sm">{attachment.fileName}</Typography>
              <Typography level="body-sm">{attachment.size}</Typography>
            </div>
          </Stack>
        </Sheet>
      ) : (
        <Box
          sx={{ position: 'relative' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Sheet
            color={isSent ? 'primary' : 'neutral'}
            variant={isSent ? 'solid' : 'soft'}
            sx={{
              p: 1.25,
              borderRadius: 'lg',
              borderTopRightRadius: isSent ? 0 : 'lg',
              borderTopLeftRadius: isSent ? 'lg' : 0,
              backgroundColor: isSent
                ? 'var(--joy-palette-primary-solidBg)'
                : 'background.body',
            }}
          >
            <Typography
              component='div'
              level="body-sm"
              sx={{
                color: isSent
                  ? 'var(--joy-palette-common-white)'
                  : 'var(--joy-palette-text-primary)',
                  
              }}
            >
              <ReactMarkdown 
              className="markdown" 
              components={syntaxComponents}
              
              >
                {content}
              </ReactMarkdown>
            </Typography>
          </Sheet>
          {isHovered && (
            <Stack
              direction="row"
              justifyContent={isSent ? 'flex-end' : 'flex-start'}
              spacing={0.5}
              sx={{
                position: 'absolute',
                top: '50%',
                p: 1.5,
                ...(isSent
                  ? {
                    left: 0,
                    transform: 'translate(-100%, -50%)',
                  }
                  : {
                    right: 0,
                    transform: 'translate(100%, -50%)',
                  }),
              }}
            >
              <IconButton
                variant={'plain'}
                color={'neutral'}
                size="sm"
                onClick={() => copyToClipboard(content)}
              >
                <CopyToClipBoardIcon />
              </IconButton>
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
}, (prevProps, nextProps) => {
  // Check if the relevant message properties are the same
  return prevProps.content === nextProps.content &&
    prevProps.variant === nextProps.variant &&
    prevProps.timestamp === nextProps.timestamp &&
    prevProps.sender.name === nextProps.sender.name
});

export default ChatBubble;