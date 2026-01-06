import { MessageSquare, ExternalLink, Globe } from 'lucide-react';
import { useState } from 'react';

const chatProviders = [
  { id: 'gchat', name: 'Google Chat', url: 'https://chat.google.com', color: 'bg-green-500' },
  { id: 'discord', name: 'Discord', url: 'https://discord.com/app', color: 'bg-indigo-500' },
  { id: 'telegram', name: 'Telegram', url: 'https://web.telegram.org', color: 'bg-blue-500' },
  { id: 'whatsapp', name: 'WhatsApp', url: 'https://web.whatsapp.com', color: 'bg-green-600' },
  { id: 'slack', name: 'Slack', url: 'https://app.slack.com', color: 'bg-purple-600' },
  { id: 'messenger', name: 'Messenger', url: 'https://www.messenger.com', color: 'bg-blue-600' },
];

export function MessagesApp() {
  const handleProviderClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="h-full w-full bg-white dark:bg-[#1a1a1a] text-foreground flex flex-col">
      <div className="border-b border-zinc-200 dark:border-zinc-800 p-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-cyan-500" />
          <h1 className="text-xl font-semibold">Messages</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <MessageSquare className="w-16 h-16 text-cyan-500 mb-6" />
        <h2 className="text-2xl font-bold mb-2">Connect to chat</h2>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Choose your messaging app to connect with friends and family
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-lg">
          {chatProviders.map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleProviderClick(provider.url)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className={`w-12 h-12 ${provider.color} rounded-xl flex items-center justify-center`}>
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="font-medium text-sm">{provider.name}</div>
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-8 text-center">
          Chat apps will open in a new browser tab
        </p>
      </div>
    </div>
  );
}
