import { ChatProps, SettingProps } from './types';

const defaultChat: ChatProps = {
  id: '1',
  sender: {
    name: 'GPT',
    username: '@gpt',
    online: false,
  },
  messages: [
    {
      id: '1',
      content: 'Hello, how can I assist today?',
      timestamp: new Date().toISOString(),
      sender: {
        name: 'GPT',
      },
    },
  ],
};

export default class IndexedDBHelper {
  private static db: IDBDatabase | null = null;

  static async initDB() {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const openRequest = indexedDB.open('openailocalchats',1); //increment for migration

      openRequest.onupgradeneeded = function (event) {
        const db = openRequest.result;

        //MIGRATIONS TODO
        if (event.oldVersion < 1) {
          const chatsStore = db.createObjectStore('chats', { keyPath: 'id' });
          const settings = db.createObjectStore('settings', { keyPath: 'id' });
          settings.add(
            {
              id: '1',
              apiKey: '',
              temperature: 0.5,
              model: "gpt-4",
              topp: 1,
              maxtokens: 4000,
              presencePenalty: 0,
              frequencyPenalty: 0,
              historyCompression: 1000,
              sendMemory: true
            }
          );
          chatsStore.add(defaultChat);
        }

      };

      openRequest.onsuccess = function () {
        IndexedDBHelper.db = openRequest.result;
        resolve(IndexedDBHelper.db);
      };

      openRequest.onerror = function () {
        reject(openRequest.error);
      };
    });
  }

  static async getSettings(): Promise<{ id: string, apiKey: string, temperature: number, model: string, topp:number, maxtokens:number, presencePenalty:number, frequencePenalty: number, historyCompression: number, sendMemory:boolean }> {
    const db = await IndexedDBHelper.initDB();
    return new Promise<{ id: string, apiKey: string, temperature: number, model: string, topp:number, maxtokens:number, presencePenalty:number, frequencePenalty: number, historyCompression: number, sendMemory:boolean  }>((resolve, reject) => {
      const transaction = db.transaction('settings', 'readonly');
      const settings = transaction.objectStore('settings');
      const request = settings.get('1');

      request.onsuccess = function () {
        resolve(request.result);
      };

      request.onerror = function () {
        reject(request.error);
      };
    });
  }


  static async setSettings(settings: SettingProps) {
    const db = await IndexedDBHelper.initDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('settings', 'readwrite');
      const settingsStore = transaction.objectStore('settings');
      const request = settingsStore.put({ id: '1', ...settings });
  
      request.onsuccess = function () {
        resolve();
      };
  
      request.onerror = function () {
        reject(request.error);
      };
    });
  }

  static async addChat(chat: ChatProps) {
    const db = await IndexedDBHelper.initDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('chats', 'readwrite');
      const chats = transaction.objectStore('chats');
      const request = chats.add(chat);

      request.onsuccess = function () {
        resolve();
      };

      request.onerror = function () {
        reject(request.error);
      };
    });
  }


  static async updateChat(chat: ChatProps) {
    const db = await IndexedDBHelper.initDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('chats', 'readwrite');
      const chats = transaction.objectStore('chats');
      const request = chats.put(chat);

      request.onsuccess = function () {
        resolve();
      };

      request.onerror = function () {
        reject(request.error);
      };
    });
  }
  

  static async getAllChats(): Promise<ChatProps[]> {
    const db = await IndexedDBHelper.initDB();
    return new Promise<ChatProps[]>((resolve, reject) => {
      const transaction = db.transaction('chats', 'readonly');
      const chats = transaction.objectStore('chats');
      const request = chats.getAll();

      request.onsuccess = function () {
        resolve(request.result);
      };

      request.onerror = function () {
        reject(request.error);
      };
    });
  }

  static async deleteChat(id: string) {
    const db = await IndexedDBHelper.initDB();
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('chats', 'readwrite');
      const chats = transaction.objectStore('chats');
      const request = chats.delete(id);

      request.onsuccess = function () {
        resolve();
      };

      request.onerror = function () {
        reject(request.error);
      };
    });
  }
}
