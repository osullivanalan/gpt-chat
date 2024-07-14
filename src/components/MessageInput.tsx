import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import Textarea from '@mui/joy/Textarea';
import { IconButton, Stack, Typography } from '@mui/joy';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import prompts from '../models/prompts';
import { useEffect } from 'react';

export type MessageInputProps = {
  textAreaValue: string;
  setTextAreaValue: (value: string) => void;
  handleNewMessage: (message: string) => void;
};

export default function MessageInput(props: MessageInputProps) {
  const { textAreaValue, setTextAreaValue, handleNewMessage } = props;
  const textAreaRef = React.useRef<HTMLDivElement>(null);

  const [isCommandMode, setIsCommandMode] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<{ act: string; prompt: string; }[]>([]);
  const [searchText, setSearchText] = React.useState('');
  const [selectedResultIndex, setSelectedResultIndex] = React.useState(0);

  useEffect(() => {
    const handleKeyDown = (event: { key: string; }) => {
      if (searchResults.length > 0) {
        if (event.key === 'ArrowUp') {
          setSelectedResultIndex((oldIndex) => Math.max(0, oldIndex - 1));
        } else if (event.key === 'ArrowDown') {
          setSelectedResultIndex((oldIndex) => Math.min(searchResults.length - 1, oldIndex + 1));
        } else if (event.key === 'Enter' && searchResults[selectedResultIndex]) {
          setTextAreaValue(searchResults[selectedResultIndex].prompt);
          setIsCommandMode(false);
          setSearchResults([]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchResults, selectedResultIndex, setTextAreaValue]);

  function handleTextAreaChange(event: { target: { value: any; }; }) {
    const value = event.target.value;
    setTextAreaValue(value);

    if (value.endsWith('/')) {
      setIsCommandMode(true);
    } else if (isCommandMode) {
      const search = value.split('/').pop() || '';
      setSearchText(search);
      setSearchResults(
        prompts.filter((prompt) =>
          prompt.act.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }

  function handleTextAreaKeyDown(event: { key: string; metaKey: any; ctrlKey: any; }) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      handleClick();
    } else if (event.key === 'Escape' && isCommandMode) {
      setIsCommandMode(false);
      setSearchResults([]);
    }
  }

  const handleClick = () => {
    if (textAreaValue.trim() !== '') {
      handleNewMessage(textAreaValue);
      setTextAreaValue('');
    }
  };

  return (
    <Box sx={{ px: 2, pb: 3 }}>
      <FormControl>
        {isCommandMode && searchResults.length > 0 && (
          <Box
            sx={{
              boxSizing: 'border-box',
              width: "100%",
              maxHeight: '400px',
              overflow: 'auto',
              minHeight: 0,
              px: 2,
              py: 3,
              borderRadius: "lg",
              marginBottom: 2,
              backgroundColor: "background.body",
            }}
          >
            <Stack direction="column" spacing={1}>
              {searchResults.map((result, index) => (
                <Box
                  key={index}
                  sx={{
                    cursor: 'pointer',
                    padding: '10px',
                    backgroundColor: 'background.backdrop',
                    borderRadius: 1,
                    border: index === selectedResultIndex ? '1px solid #0d6efd' : 'none',
                  }}
                  onClick={() => {
                    setTextAreaValue(result.prompt);
                    setIsCommandMode(false);
                    setSearchResults([]);
                  }}
                >
                  <Typography level="title-md">{result.act}</Typography>
                  <Typography
                    level="title-sm"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {result.prompt.split('\n')[0]}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        <Textarea
          placeholder="Type your AI question here…"
          aria-label="Message"
          ref={textAreaRef}
          onKeyDown={handleTextAreaKeyDown}
          onChange={handleTextAreaChange}
          value={textAreaValue}
          minRows={3}
          maxRows={10}
          endDecorator={
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexGrow={1}
              sx={{
                py: 1,
                pr: 1,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Button
                size="sm"
                color="primary"
                sx={{ alignSelf: 'center', borderRadius: 'sm' }}
                endDecorator={<SendRoundedIcon />}
                onClick={handleClick}
              >
                Send
              </Button>
            </Stack>
          }
          sx={{
            '& textarea:first-of-type': {
              minHeight: 72,
            },
          }}
        />
      </FormControl>
    </Box>
  );
}