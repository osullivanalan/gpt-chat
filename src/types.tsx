import { ReactNode } from "react";

export type UserProps = {
  name: string;
  username?: string;
  online?: boolean;
};

export type MessageProps = {
  id: string;
  content: string;
  timestamp: string;
  unread?: boolean;
  sender: UserProps;
  attachment?: {
    fileName: string;
    type: string;
    size: string;
  };
};


export type SettingProps = {
  apiKey: string;
  temperature: number;
  model: string;
  topp: number;
  maxtokens: number;
  presencePenalty: number;
  frequencePenalty: number;
  historyCompression: number;
  sendMemory: boolean;
}

export type SettingsContextProps = {
  openSettings: boolean;
  setSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  settings:SettingProps | null;
  //setSettings: (settings: SettingProps | null) => void;
  setSettings: React.Dispatch<React.SetStateAction<SettingProps | null>>;
};

export type ChatProps = {
  id: string;
  sender: UserProps;
  messages: MessageProps[];
};

export type ModelProps = {
  code: string;
  label: string;
};