import { Settings } from "@mui/icons-material";
import { List, ListItem, ListItemButton, IconButton, Typography, Box } from "@mui/joy";
import ColorSchemeToggle from "./ColorSchemeToggle";
import { useContext } from "react";
import { SettingsContext } from "../contexts/SettingsContext";
import { ChatProps, MessageProps, ChatsPaneProps } from "../types";
import MessageIcon from '@mui/icons-material/Message';
import IndexedDBHelper from "../IndexedDBHelper";

export default function SettingsMenu(props: ChatsPaneProps) {

    const settingsContext = useContext(SettingsContext);

    if (!settingsContext) {
        throw new Error('Settings must be used within a SettingsProvider');
    }

    const { openSettings, setSettingsOpen, settings } = settingsContext;

    const { chats, setChats, setSelectedChat } = props;

    const addNewChat = async (newChat: ChatProps) => {
        // Add the new chat to the list of chats
        const updatedChats = [...chats, newChat];

        setChats(updatedChats);
        // Add the new chat to the database
        await IndexedDBHelper.addChat(newChat);
    };

    const createNewMesssageThread = async () => {
        const newMessage: MessageProps = {
            id: Date.now().toString(),
            content: "How can I help?",
            timestamp: new Date().toISOString(),
            sender: {
                name: 'GPT'
            },
        };

        const newChat: ChatProps = {
            id: Date.now().toString(),
            messages: [newMessage],
            sender: {
                name: 'GPT'
            }
            // Add any other necessary properties here
        };

        addNewChat(newChat);
        setSelectedChat(newChat);
    }

    return (

        <List role="menubar" orientation="horizontal"
            sx={{
                display: "flex",
                alignItems: "flex-end",
                p: 1,
                flexShrink: 0, // don't shrink this element
                width: '100%', // to make sure it spans the full width of the parent
            }}
        >
            <ListItem>
                <ListItemButton role="menuitem">
                    <IconButton
                        size="sm"
                        variant="outlined"
                        color="neutral"
                        onClick={() => setSettingsOpen(true)}
                    >
                        <Settings />
                    </IconButton>
                </ListItemButton>
            </ListItem>
            <ListItem>
                <ListItemButton role="menuitem"  >
                    <ColorSchemeToggle sx={{ ml: 'auto' }} />
                </ListItemButton>
            </ListItem>
            <ListItem sx={{ ml: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}> {/* Auto margin and flex properties align the element to the right */}
                <IconButton
                    variant="plain"
                    aria-label="add new chat"
                    color="neutral"
                    size="sm"
                    onClick={createNewMesssageThread}
                >
                    <Typography sx={{ mr: 1 }}>New Chat</Typography>
                    <MessageIcon />
                </IconButton>
            </ListItem>
        </List>
    )
}