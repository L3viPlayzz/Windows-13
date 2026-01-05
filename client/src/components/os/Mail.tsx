import { Mail, ExternalLink, Globe } from 'lucide-react';
import { useState } from 'react';

const emailProviders = [
  { id: 'gmail', name: 'Gmail', url: 'https://mail.google.com', color: 'bg-red-500' },
  { id: 'outlook', name: 'Outlook', url: 'https://outlook.live.com', color: 'bg-blue-500' },
  { id: 'yahoo', name: 'Yahoo Mail', url: 'https://mail.yahoo.com', color: 'bg-purple-500' },
  { id: 'proton', name: 'ProtonMail', url: 'https://mail.proton.me', color: 'bg-violet-600' },
];

export function MailApp() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [showBrowser, setShowBrowser] = useState(false);

  const handleProviderClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="h-full w-full bg-white dark:bg-[#1a1a1a] text-foreground flex flex-col">
      <div className="border-b border-zinc-200 dark:border-zinc-800 p-4">
        <div className="flex items-center gap-3">
          <Mail className="w-6 h-6 text-blue-500" />
          <h1 className="text-xl font-semibold">Mail</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <Mail className="w-16 h-16 text-blue-500 mb-6" />
        <h2 className="text-2xl font-bold mb-2">Connect your email</h2>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Choose your email provider to open your inbox in a new tab
        </p>

        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          {emailProviders.map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleProviderClick(provider.url)}
              className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className={`w-10 h-10 ${provider.color} rounded-lg flex items-center justify-center`}>
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div className="text-left flex-1">
                <div className="font-medium">{provider.name}</div>
                <div className="text-xs text-muted-foreground">Open in browser</div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-8 text-center">
          Your email will open in a new browser tab for security
        </p>
      </div>
    </div>
  );
}
