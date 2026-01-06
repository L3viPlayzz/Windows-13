import { useState, useRef, useEffect } from 'react';

function SteamLocomotive() {
  const [position, setPosition] = useState(100);
  const [smokeFrame, setSmokeFrame] = useState(0);
  
  useEffect(() => {
    const moveInterval = setInterval(() => {
      setPosition(prev => {
        if (prev <= -120) return 100;
        return prev - 0.5;
      });
    }, 20);
    
    const smokeInterval = setInterval(() => {
      setSmokeFrame(prev => (prev + 1) % 2);
    }, 200);
    
    return () => {
      clearInterval(moveInterval);
      clearInterval(smokeInterval);
    };
  }, []);
  
  const trainArt = smokeFrame === 0 ? `
            (@@)
        (    )
     (@@@@)

   (   )
   ====
_D _|  |_______/        \\__I_I_____===__|_________|
 |(_)---  |   H\\________/ |   |        =|___ ___|      _________________
 /     |  |   H  |  |     |   |         ||_| |_||     _|                \\_____A
|      |  |   H  |__--------------------| [___] |   =|                        |
| ________|___H__/__|_____/[][]~\\_______|       |   -|                        |
|/ |   |-----------I_____I [][] []  D   |=======|____|________________________|_
__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|__________________________|_
 |/-=|___|=    ||    ||    ||    |_____/~\\___/          |_D__D__D_|  |_D__D__D_|
  \\_/      \\O=====O=====O=====O_/      \\_/               \\_/   \\_/    \\_/   \\_/
` : `
         (@@@)
     (    )
  (@@@@)

 (   )
 ====
_D _|  |_______/        \\__I_I_____===__|_________|
 |(_)---  |   H\\________/ |   |        =|___ ___|      _________________
 /     |  |   H  |  |     |   |         ||_| |_||     _|                \\_____A
|      |  |   H  |__--------------------| [___] |   =|                        |
| ________|___H__/__|_____/[][]~\\_______|       |   -|                        |
|/ |   |-----------I_____I [][] []  D   |=======|____|________________________|_
__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|__________________________|_
 |/-=|___|=   ||    ||    ||    |_____/~\\___/          |_D__D__D_|  |_D__D__D_|
  \\_/      \\O=====O=====O=====O_/      \\_/               \\_/   \\_/    \\_/   \\_/
`;

  return (
    <div className="overflow-hidden bg-slate-950 py-2 rounded" style={{ width: '100%', height: '260px' }}>
      <pre 
        className="text-white font-mono text-xs whitespace-pre leading-tight"
        style={{ 
          transform: `translateX(${position}%)`,
          transition: 'transform 0.02s linear'
        }}
      >
        {trainArt}
      </pre>
    </div>
  );
}

interface Command {
  input: string;
  output: string | React.ReactNode;
  path: string;
}

interface FileSystemNode {
  type: 'file' | 'folder';
  name: string;
  content?: string;
  children?: Record<string, FileSystemNode>;
  size?: number;
  created?: Date;
}

const initialFileSystem: Record<string, FileSystemNode> = {
  'C:': {
    type: 'folder',
    name: 'C:',
    children: {
      'Users': {
        type: 'folder',
        name: 'Users',
        children: {
          'Levi': {
            type: 'folder',
            name: 'Levi',
            children: {
              'Desktop': { type: 'folder', name: 'Desktop', children: {
                'shortcuts.lnk': { type: 'file', name: 'shortcuts.lnk', content: 'Shortcut file', size: 1024 },
              }},
              'Documents': { type: 'folder', name: 'Documents', children: {
                'notes.txt': { type: 'file', name: 'notes.txt', content: 'My personal notes\n\nTODO:\n- Learn more about Windows 13\n- Try new features', size: 89 },
                'readme.md': { type: 'file', name: 'readme.md', content: '# Windows 13 Simulator\n\nWelcome to the Windows 13 Simulator!', size: 256 },
                'budget.csv': { type: 'file', name: 'budget.csv', content: 'Category,Amount\nFood,500\nRent,1200\nUtilities,150\nEntertainment,200', size: 78 },
              }},
              'Downloads': { type: 'folder', name: 'Downloads', children: {
                'setup.exe': { type: 'file', name: 'setup.exe', content: '[Binary file]', size: 4096 },
                'photo.jpg': { type: 'file', name: 'photo.jpg', content: '[Image file]', size: 2048 },
              }},
              'Music': { type: 'folder', name: 'Music', children: {
                'playlist.m3u': { type: 'file', name: 'playlist.m3u', content: '#EXTM3U\ntrack1.mp3\ntrack2.mp3', size: 128 },
              } },
              'Pictures': { type: 'folder', name: 'Pictures', children: {
                'vacation': { type: 'folder', name: 'vacation', children: {} },
              } },
              'Videos': { type: 'folder', name: 'Videos', children: {} },
              '.config': { type: 'folder', name: '.config', children: {
                'settings.json': { type: 'file', name: 'settings.json', content: '{\n  "theme": "dark",\n  "fontSize": 14\n}', size: 42 },
              }},
            }
          }
        }
      },
      'Windows': {
        type: 'folder',
        name: 'Windows',
        children: {
          'System32': { type: 'folder', name: 'System32', children: {
            'drivers': { type: 'folder', name: 'drivers', children: {} },
            'config': { type: 'folder', name: 'config', children: {} },
          } },
          'Fonts': { type: 'folder', name: 'Fonts', children: {} },
          'Logs': { type: 'folder', name: 'Logs', children: {
            'system.log': { type: 'file', name: 'system.log', content: '[2024-01-15 10:23:45] System started\n[2024-01-15 10:23:46] All services running', size: 512 },
          }},
        }
      },
      'Program Files': { type: 'folder', name: 'Program Files', children: {
        'Windows Defender': { type: 'folder', name: 'Windows Defender', children: {} },
        'Common Files': { type: 'folder', name: 'Common Files', children: {} },
      } },
      'Program Files (x86)': { type: 'folder', name: 'Program Files (x86)', children: {} },
      'Temp': { type: 'folder', name: 'Temp', children: {} },
    }
  }
};

export function TerminalApp() {
  const [history, setHistory] = useState<Command[]>([
    { input: '', output: 'Windows 13 PowerShell\nCopyright (c) Microsoft Corporation. All rights reserved.\n\nType "help" for available commands.', path: '' }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentPath, setCurrentPath] = useState('C:\\Users\\Levi');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [fileSystem, setFileSystem] = useState(initialFileSystem);
  const [env, setEnv] = useState<Record<string, string>>({
    'USERNAME': 'Levi',
    'COMPUTERNAME': 'WINDOWS13',
    'OS': 'Windows_NT',
    'PROCESSOR_ARCHITECTURE': 'AMD64',
    'SystemRoot': 'C:\\Windows',
    'USERPROFILE': 'C:\\Users\\Levi',
    'TEMP': 'C:\\Users\\Levi\\AppData\\Local\\Temp',
    'PATH': 'C:\\Windows\\System32;C:\\Windows;C:\\Program Files',
    'SHELL': 'PowerShell',
    'TERM': 'xterm-256color',
    'HOME': 'C:\\Users\\Levi',
  });
  const [aliases, setAliases] = useState<Record<string, string>>({
    'll': 'ls -la',
    'la': 'ls -a',
    'c': 'clear',
    'h': 'history',
  });
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const getNodeAtPath = (path: string): FileSystemNode | null => {
    const parts = path.split('\\').filter(Boolean);
    let current: FileSystemNode | undefined = fileSystem[parts[0]];
    
    for (let i = 1; i < parts.length; i++) {
      if (!current?.children) return null;
      current = current.children[parts[i]];
      if (!current) return null;
    }
    
    return current || null;
  };

  const resolvePath = (inputPath: string): string => {
    if (inputPath.match(/^[A-Z]:\\/i)) {
      return inputPath;
    }
    
    if (inputPath === '..') {
      const parts = currentPath.split('\\');
      parts.pop();
      return parts.length > 1 ? parts.join('\\') : parts[0] + '\\';
    }
    
    if (inputPath === '.') {
      return currentPath;
    }
    
    if (inputPath.startsWith('..\\')) {
      const parts = currentPath.split('\\');
      parts.pop();
      return resolvePath(parts.join('\\') + '\\' + inputPath.slice(3));
    }
    
    if (inputPath.startsWith('~')) {
      return 'C:\\Users\\Levi' + inputPath.slice(1).replace(/\//g, '\\');
    }
    
    return currentPath + '\\' + inputPath;
  };

  const createNodeAtPath = (path: string, node: FileSystemNode) => {
    const parts = path.split('\\').filter(Boolean);
    const newFileSystem = JSON.parse(JSON.stringify(fileSystem));
    let current = newFileSystem[parts[0]];
    
    for (let i = 1; i < parts.length - 1; i++) {
      if (!current?.children?.[parts[i]]) return false;
      current = current.children[parts[i]];
    }
    
    if (current?.children) {
      current.children[parts[parts.length - 1]] = node;
      setFileSystem(newFileSystem);
      return true;
    }
    return false;
  };

  const deleteNodeAtPath = (path: string) => {
    const parts = path.split('\\').filter(Boolean);
    const newFileSystem = JSON.parse(JSON.stringify(fileSystem));
    let current = newFileSystem[parts[0]];
    
    for (let i = 1; i < parts.length - 1; i++) {
      if (!current?.children?.[parts[i]]) return false;
      current = current.children[parts[i]];
    }
    
    if (current?.children && current.children[parts[parts.length - 1]]) {
      delete current.children[parts[parts.length - 1]];
      setFileSystem(newFileSystem);
      return true;
    }
    return false;
  };

  const handleCommand = (cmd: string) => {
    let trimmedCmd = cmd.trim();
    
    if (trimmedCmd) {
      setCommandHistory(prev => [...prev, trimmedCmd]);
      setHistoryIndex(-1);
    }

    // Check for aliases
    const firstWord = trimmedCmd.split(/\s+/)[0];
    if (aliases[firstWord]) {
      trimmedCmd = trimmedCmd.replace(firstWord, aliases[firstWord]);
    }
    
    const args = trimmedCmd.split(/\s+/);
    const command = args[0].toLowerCase();
    let output: string | React.ReactNode = '';

    switch (command) {
      case 'help':
      case '?':
        output = (
          <div className="space-y-2">
            <div className="text-cyan-400 font-bold mb-2">Available Commands:</div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
              <div className="text-yellow-300 font-semibold col-span-2 mt-2">Navigation & Files</div>
              <div><span className="text-yellow-400">ls/dir</span> - List directory</div>
              <div><span className="text-yellow-400">cd [path]</span> - Change directory</div>
              <div><span className="text-yellow-400">pwd</span> - Print working directory</div>
              <div><span className="text-yellow-400">cat [file]</span> - Display file contents</div>
              <div><span className="text-yellow-400">mkdir [name]</span> - Create directory</div>
              <div><span className="text-yellow-400">touch [name]</span> - Create file</div>
              <div><span className="text-yellow-400">rm [name]</span> - Remove file/folder</div>
              <div><span className="text-yellow-400">cp [src] [dst]</span> - Copy file</div>
              <div><span className="text-yellow-400">mv [src] [dst]</span> - Move/rename file</div>
              <div><span className="text-yellow-400">tree</span> - Display directory tree</div>
              <div><span className="text-yellow-400">find [pattern]</span> - Find files</div>
              <div><span className="text-yellow-400">head [file]</span> - Show first lines</div>
              <div><span className="text-yellow-400">tail [file]</span> - Show last lines</div>
              <div><span className="text-yellow-400">wc [file]</span> - Word/line count</div>
              
              <div className="text-yellow-300 font-semibold col-span-2 mt-2">System Info</div>
              <div><span className="text-yellow-400">whoami</span> - Current user</div>
              <div><span className="text-yellow-400">hostname</span> - Computer name</div>
              <div><span className="text-yellow-400">date</span> - Current date/time</div>
              <div><span className="text-yellow-400">uptime</span> - System uptime</div>
              <div><span className="text-yellow-400">neofetch</span> - System info</div>
              <div><span className="text-yellow-400">systeminfo</span> - Detailed info</div>
              <div><span className="text-yellow-400">uname</span> - OS info</div>
              <div><span className="text-yellow-400">df</span> - Disk space</div>
              <div><span className="text-yellow-400">free</span> - Memory usage</div>
              <div><span className="text-yellow-400">top</span> - Process monitor</div>
              
              <div className="text-yellow-300 font-semibold col-span-2 mt-2">Network</div>
              <div><span className="text-yellow-400">ping [host]</span> - Ping host</div>
              <div><span className="text-yellow-400">ipconfig</span> - IP configuration</div>
              <div><span className="text-yellow-400">netstat</span> - Network stats</div>
              <div><span className="text-yellow-400">curl [url]</span> - Fetch URL</div>
              <div><span className="text-yellow-400">wget [url]</span> - Download file</div>
              <div><span className="text-yellow-400">traceroute [host]</span> - Trace route</div>
              <div><span className="text-yellow-400">nslookup [host]</span> - DNS lookup</div>
              
              <div className="text-yellow-300 font-semibold col-span-2 mt-2">Processes</div>
              <div><span className="text-yellow-400">tasklist/ps</span> - List processes</div>
              <div><span className="text-yellow-400">kill [pid]</span> - Kill process</div>
              <div><span className="text-yellow-400">jobs</span> - List background jobs</div>
              
              <div className="text-yellow-300 font-semibold col-span-2 mt-2">Text Processing</div>
              <div><span className="text-yellow-400">echo [text]</span> - Print text</div>
              <div><span className="text-yellow-400">grep [pattern] [file]</span> - Search text</div>
              <div><span className="text-yellow-400">sort [file]</span> - Sort lines</div>
              <div><span className="text-yellow-400">uniq [file]</span> - Remove duplicates</div>
              <div><span className="text-yellow-400">base64 [text]</span> - Encode/decode</div>
              <div><span className="text-yellow-400">rev [text]</span> - Reverse text</div>
              
              <div className="text-yellow-300 font-semibold col-span-2 mt-2">Environment</div>
              <div><span className="text-yellow-400">env/set</span> - Show env vars</div>
              <div><span className="text-yellow-400">export VAR=val</span> - Set env var</div>
              <div><span className="text-yellow-400">alias</span> - Show/set aliases</div>
              <div><span className="text-yellow-400">unset [VAR]</span> - Remove var</div>
              
              <div className="text-yellow-300 font-semibold col-span-2 mt-2">Utilities</div>
              <div><span className="text-yellow-400">calc [expr]</span> - Calculator</div>
              <div><span className="text-yellow-400">bc</span> - Calculator mode</div>
              <div><span className="text-yellow-400">yes [text]</span> - Repeat text</div>
              <div><span className="text-yellow-400">seq [n]</span> - Number sequence</div>
              <div><span className="text-yellow-400">sleep [sec]</span> - Pause execution</div>
              <div><span className="text-yellow-400">timer [sec]</span> - Countdown timer</div>
              
              <div className="text-yellow-300 font-semibold col-span-2 mt-2">Fun</div>
              <div><span className="text-yellow-400">cowsay [text]</span> - ASCII cow</div>
              <div><span className="text-yellow-400">fortune</span> - Random quote</div>
              <div><span className="text-yellow-400">matrix</span> - Matrix effect</div>
              <div><span className="text-yellow-400">cmatrix</span> - Matrix animation</div>
              <div><span className="text-yellow-400">weather [city]</span> - Weather info</div>
              <div><span className="text-yellow-400">joke</span> - Random joke</div>
              <div><span className="text-yellow-400">figlet [text]</span> - ASCII art text</div>
              <div><span className="text-yellow-400">lolcat [text]</span> - Rainbow text</div>
              <div><span className="text-yellow-400">sl</span> - Steam locomotive</div>
              <div><span className="text-yellow-400">aquarium</span> - ASCII aquarium</div>
              
              <div className="text-yellow-300 font-semibold col-span-2 mt-2">Terminal</div>
              <div><span className="text-yellow-400">clear/cls</span> - Clear screen</div>
              <div><span className="text-yellow-400">history</span> - Command history</div>
              <div><span className="text-yellow-400">exit</span> - Exit terminal</div>
              <div><span className="text-yellow-400">reset</span> - Reset terminal</div>
            </div>
          </div>
        );
        break;

      case 'clear':
      case 'cls':
        setHistory([]);
        return;

      case 'ls':
      case 'dir':
        const showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al');
        const longFormat = args.includes('-l') || args.includes('-la') || args.includes('-al');
        const lsPathArg = args.find(a => !a.startsWith('-') && a !== command);
        const lsPath = lsPathArg ? resolvePath(lsPathArg) : currentPath;
        const lsNode = getNodeAtPath(lsPath);
        if (!lsNode || lsNode.type !== 'folder') {
          output = `The system cannot find the path specified: ${lsPath}`;
        } else {
          let entries = Object.values(lsNode.children || {});
          if (!showHidden) {
            entries = entries.filter(e => !e.name.startsWith('.'));
          }
          if (entries.length === 0) {
            output = 'Directory is empty.';
          } else {
            output = (
              <div>
                <div className="text-zinc-500 mb-1">Directory of {lsPath}</div>
                <div className="grid gap-1">
                  {entries.map((entry, i) => (
                    <div key={i} className={`flex gap-4 ${longFormat ? '' : 'inline-block mr-4'}`}>
                      {longFormat && (
                        <>
                          <span className="text-zinc-500 w-10">{entry.type === 'folder' ? 'd' : '-'}rwx</span>
                          <span className="text-zinc-500 w-20 text-right">{entry.type === 'folder' ? '<DIR>' : `${entry.size || 0}`}</span>
                        </>
                      )}
                      <span className={entry.type === 'folder' ? 'text-blue-400' : 'text-zinc-300'}>{entry.name}</span>
                    </div>
                  ))}
                </div>
                <div className="text-zinc-500 mt-1">{entries.length} item(s)</div>
              </div>
            );
          }
        }
        break;

      case 'cd':
        if (!args[1]) {
          setCurrentPath('C:\\Users\\Levi');
          output = '';
        } else if (args[1] === '-') {
          output = currentPath;
        } else {
          const newPath = resolvePath(args[1]);
          const node = getNodeAtPath(newPath);
          if (node && node.type === 'folder') {
            setCurrentPath(newPath.replace(/\\+$/, ''));
            output = '';
          } else {
            output = `The system cannot find the path specified: ${newPath}`;
          }
        }
        break;

      case 'pwd':
        output = currentPath;
        break;

      case 'cat':
      case 'type':
        if (!args[1]) {
          output = 'Usage: cat <filename>';
        } else {
          const filePath = resolvePath(args[1]);
          const fileNode = getNodeAtPath(filePath);
          if (!fileNode) {
            output = `cat: ${args[1]}: No such file or directory`;
          } else if (fileNode.type === 'folder') {
            output = `cat: ${args[1]}: Is a directory`;
          } else {
            output = fileNode.content || '(empty file)';
          }
        }
        break;

      case 'head':
        if (!args[1]) {
          output = 'Usage: head [-n lines] <filename>';
        } else {
          const lines = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 10 : 10;
          const headFile = args.find(a => !a.startsWith('-') && a !== command && !parseInt(a));
          if (headFile) {
            const filePath = resolvePath(headFile);
            const fileNode = getNodeAtPath(filePath);
            if (fileNode && fileNode.content) {
              output = fileNode.content.split('\n').slice(0, lines).join('\n');
            } else {
              output = `head: ${headFile}: No such file`;
            }
          }
        }
        break;

      case 'tail':
        if (!args[1]) {
          output = 'Usage: tail [-n lines] <filename>';
        } else {
          const lines = args.includes('-n') ? parseInt(args[args.indexOf('-n') + 1]) || 10 : 10;
          const tailFile = args.find(a => !a.startsWith('-') && a !== command && !parseInt(a));
          if (tailFile) {
            const filePath = resolvePath(tailFile);
            const fileNode = getNodeAtPath(filePath);
            if (fileNode && fileNode.content) {
              const allLines = fileNode.content.split('\n');
              output = allLines.slice(-lines).join('\n');
            } else {
              output = `tail: ${tailFile}: No such file`;
            }
          }
        }
        break;

      case 'wc':
        if (!args[1]) {
          output = 'Usage: wc <filename>';
        } else {
          const filePath = resolvePath(args[1]);
          const fileNode = getNodeAtPath(filePath);
          if (fileNode && fileNode.content) {
            const content = fileNode.content;
            const lines = content.split('\n').length;
            const words = content.split(/\s+/).filter(Boolean).length;
            const chars = content.length;
            output = `  ${lines}  ${words}  ${chars} ${args[1]}`;
          } else {
            output = `wc: ${args[1]}: No such file`;
          }
        }
        break;

      case 'mkdir':
        if (!args[1]) {
          output = 'Usage: mkdir <directory_name>';
        } else {
          const newDirPath = resolvePath(args[1]);
          const newDir: FileSystemNode = { type: 'folder', name: args[1], children: {} };
          if (createNodeAtPath(newDirPath, newDir)) {
            output = `Directory created: ${args[1]}`;
          } else {
            output = `mkdir: cannot create directory '${args[1]}'`;
          }
        }
        break;

      case 'touch':
        if (!args[1]) {
          output = 'Usage: touch <filename>';
        } else {
          const newFilePath = resolvePath(args[1]);
          const newFile: FileSystemNode = { type: 'file', name: args[1], content: '', size: 0 };
          if (createNodeAtPath(newFilePath, newFile)) {
            output = `File created: ${args[1]}`;
          } else {
            output = `touch: cannot create file '${args[1]}'`;
          }
        }
        break;

      case 'rm':
      case 'del':
        if (!args[1]) {
          output = 'Usage: rm <filename>';
        } else {
          const rmPath = resolvePath(args[1]);
          if (deleteNodeAtPath(rmPath)) {
            output = `Removed: ${args[1]}`;
          } else {
            output = `rm: cannot remove '${args[1]}': No such file or directory`;
          }
        }
        break;

      case 'cp':
        if (args.length < 3) {
          output = 'Usage: cp <source> <destination>';
        } else {
          output = `Copied ${args[1]} to ${args[2]}`;
        }
        break;

      case 'mv':
        if (args.length < 3) {
          output = 'Usage: mv <source> <destination>';
        } else {
          output = `Moved ${args[1]} to ${args[2]}`;
        }
        break;

      case 'find':
        if (!args[1]) {
          output = 'Usage: find <pattern>';
        } else {
          const pattern = args[1].toLowerCase();
          const findResults: string[] = [];
          const searchDir = (node: FileSystemNode, path: string) => {
            if (node.name.toLowerCase().includes(pattern)) {
              findResults.push(path);
            }
            if (node.children) {
              Object.values(node.children).forEach(child => {
                searchDir(child, path + '\\' + child.name);
              });
            }
          };
          Object.entries(fileSystem).forEach(([key, node]) => {
            searchDir(node, key);
          });
          output = findResults.length > 0 ? findResults.join('\n') : `No files matching '${pattern}' found`;
        }
        break;

      case 'grep':
        if (args.length < 3) {
          output = 'Usage: grep <pattern> <file>';
        } else {
          const pattern = args[1];
          const filePath = resolvePath(args[2]);
          const fileNode = getNodeAtPath(filePath);
          if (fileNode && fileNode.content) {
            const matchingLines = fileNode.content
              .split('\n')
              .filter(line => line.toLowerCase().includes(pattern.toLowerCase()))
              .map(line => line.replace(new RegExp(`(${pattern})`, 'gi'), '\x1b[31m$1\x1b[0m'));
            output = matchingLines.length > 0 ? (
              <div>
                {matchingLines.map((line, i) => (
                  <div key={i} dangerouslySetInnerHTML={{ __html: line.replace(/\x1b\[31m/g, '<span class="text-red-400">').replace(/\x1b\[0m/g, '</span>') }} />
                ))}
              </div>
            ) : `No matches for '${pattern}'`;
          } else {
            output = `grep: ${args[2]}: No such file`;
          }
        }
        break;

      case 'sort':
        if (!args[1]) {
          output = 'Usage: sort <file>';
        } else {
          const filePath = resolvePath(args[1]);
          const fileNode = getNodeAtPath(filePath);
          if (fileNode && fileNode.content) {
            output = fileNode.content.split('\n').sort().join('\n');
          } else {
            output = `sort: ${args[1]}: No such file`;
          }
        }
        break;

      case 'uniq':
        if (!args[1]) {
          output = 'Usage: uniq <file>';
        } else {
          const filePath = resolvePath(args[1]);
          const fileNode = getNodeAtPath(filePath);
          if (fileNode && fileNode.content) {
            output = Array.from(new Set(fileNode.content.split('\n'))).join('\n');
          } else {
            output = `uniq: ${args[1]}: No such file`;
          }
        }
        break;

      case 'echo':
        const echoText = args.slice(1).join(' ').replace(/"/g, '').replace(/'/g, '');
        // Handle variable expansion
        output = echoText.replace(/\$(\w+)/g, (_, name) => env[name] || '');
        break;

      case 'whoami':
        output = `${env.COMPUTERNAME}\\${env.USERNAME}`;
        break;

      case 'hostname':
        output = env.COMPUTERNAME;
        break;

      case 'uname':
        const unameFlag = args[1];
        if (unameFlag === '-a') {
          output = 'Windows_NT WINDOWS13 10.0.22621 Windows 13 x86_64 AMD64';
        } else if (unameFlag === '-s') {
          output = 'Windows_NT';
        } else if (unameFlag === '-r') {
          output = '10.0.22621';
        } else if (unameFlag === '-m') {
          output = 'x86_64';
        } else {
          output = 'Windows_NT';
        }
        break;

      case 'date':
        const dateFlag = args[1];
        const now = new Date();
        if (dateFlag === '+%Y') {
          output = now.getFullYear().toString();
        } else if (dateFlag === '+%m') {
          output = (now.getMonth() + 1).toString().padStart(2, '0');
        } else if (dateFlag === '+%d') {
          output = now.getDate().toString().padStart(2, '0');
        } else {
          output = now.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
        }
        break;

      case 'uptime':
        const uptimeMins = Math.floor(Math.random() * 60 * 24);
        const hours = Math.floor(uptimeMins / 60);
        const mins = uptimeMins % 60;
        output = `System up ${hours} hours, ${mins} minutes`;
        break;

      case 'env':
      case 'set':
      case 'printenv':
        if (command === 'set' && args[1]?.includes('=')) {
          const [key, ...valueParts] = args[1].split('=');
          const value = valueParts.join('=');
          setEnv(prev => ({ ...prev, [key]: value }));
          output = '';
        } else {
          output = (
            <div className="space-y-0.5">
              {Object.entries(env).map(([key, value]) => (
                <div key={key}><span className="text-cyan-400">{key}</span>=<span className="text-green-400">{value}</span></div>
              ))}
            </div>
          );
        }
        break;

      case 'export':
        if (args[1]?.includes('=')) {
          const [key, ...valueParts] = args[1].split('=');
          const value = valueParts.join('=').replace(/"/g, '').replace(/'/g, '');
          setEnv(prev => ({ ...prev, [key]: value }));
          output = '';
        } else {
          output = 'Usage: export VAR=value';
        }
        break;

      case 'unset':
        if (args[1]) {
          setEnv(prev => {
            const newEnv = { ...prev };
            delete newEnv[args[1]];
            return newEnv;
          });
          output = '';
        } else {
          output = 'Usage: unset <variable>';
        }
        break;

      case 'alias':
        if (args[1]?.includes('=')) {
          const [name, ...cmdParts] = args[1].split('=');
          const aliasCmd = cmdParts.join('=').replace(/"/g, '').replace(/'/g, '');
          setAliases(prev => ({ ...prev, [name]: aliasCmd }));
          output = '';
        } else if (args[1]) {
          output = aliases[args[1]] ? `${args[1]}='${aliases[args[1]]}'` : `alias: ${args[1]}: not found`;
        } else {
          output = (
            <div className="space-y-0.5">
              {Object.entries(aliases).map(([name, cmd]) => (
                <div key={name}>alias <span className="text-cyan-400">{name}</span>=<span className="text-green-400">'{cmd}'</span></div>
              ))}
            </div>
          );
        }
        break;

      case 'tree':
        output = (
          <div className="text-sm">
            <div className="text-yellow-400">{currentPath}</div>
            <div className="ml-2">
              <div className="text-blue-400">+-- Desktop</div>
              <div className="text-blue-400">+-- Documents</div>
              <div className="ml-4 text-zinc-300">|   +-- notes.txt</div>
              <div className="ml-4 text-zinc-300">|   +-- readme.md</div>
              <div className="ml-4 text-zinc-300">|   +-- budget.csv</div>
              <div className="text-blue-400">+-- Downloads</div>
              <div className="ml-4 text-zinc-300">|   +-- setup.exe</div>
              <div className="ml-4 text-zinc-300">|   +-- photo.jpg</div>
              <div className="text-blue-400">+-- Music</div>
              <div className="text-blue-400">+-- Pictures</div>
              <div className="text-blue-400">+-- Videos</div>
              <div className="text-blue-400">+-- .config</div>
            </div>
          </div>
        );
        break;

      case 'calc':
        if (!args[1]) {
          output = 'Usage: calc <expression>\nExample: calc 2+2, calc 10*5, calc sqrt(16)';
        } else {
          try {
            const expr = args.slice(1).join('')
              .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
              .replace(/sin\(([^)]+)\)/g, 'Math.sin($1)')
              .replace(/cos\(([^)]+)\)/g, 'Math.cos($1)')
              .replace(/tan\(([^)]+)\)/g, 'Math.tan($1)')
              .replace(/log\(([^)]+)\)/g, 'Math.log10($1)')
              .replace(/ln\(([^)]+)\)/g, 'Math.log($1)')
              .replace(/pow\(([^,]+),([^)]+)\)/g, 'Math.pow($1,$2)')
              .replace(/pi/gi, 'Math.PI')
              .replace(/e(?![a-z])/gi, 'Math.E')
              .replace(/\^/g, '**');
            const result = Function('"use strict"; return (' + expr + ')')();
            output = `${args.slice(1).join(' ')} = ${result}`;
          } catch (e) {
            output = 'Error: Invalid expression';
          }
        }
        break;

      case 'bc':
        output = 'bc calculator mode. Type expressions (not actually interactive in this demo)\nExample: 2+2\n= 4';
        break;

      case 'seq':
        if (!args[1]) {
          output = 'Usage: seq <end> or seq <start> <end>';
        } else {
          const start = args[2] ? parseInt(args[1]) : 1;
          const end = args[2] ? parseInt(args[2]) : parseInt(args[1]);
          output = Array.from({ length: end - start + 1 }, (_, i) => start + i).join('\n');
        }
        break;

      case 'yes':
        const yesText = args.slice(1).join(' ') || 'y';
        output = Array(10).fill(yesText).join('\n') + '\n... (press Ctrl+C to stop)';
        break;

      case 'base64':
        if (!args[1]) {
          output = 'Usage: base64 <text> or base64 -d <encoded>';
        } else if (args[1] === '-d' && args[2]) {
          try {
            output = atob(args[2]);
          } catch {
            output = 'Invalid base64 input';
          }
        } else {
          output = btoa(args.slice(1).join(' '));
        }
        break;

      case 'rev':
        output = args.slice(1).join(' ').split('').reverse().join('');
        break;

      case 'ping':
        if (!args[1]) {
          output = 'Usage: ping <hostname>';
        } else {
          const host = args[1];
          const times = [14, 12, 11, 13].map(t => t + Math.floor(Math.random() * 5));
          output = (
            <div>
              <div>Pinging {host} with 32 bytes of data:</div>
              {times.map((t, i) => (
                <div key={i}>Reply from {host}: bytes=32 time={t}ms TTL=64</div>
              ))}
              <div className="mt-2">Ping statistics for {host}:</div>
              <div className="ml-4">Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)</div>
              <div>Approximate round trip times in milli-seconds:</div>
              <div className="ml-4">Minimum = {Math.min(...times)}ms, Maximum = {Math.max(...times)}ms, Average = {Math.round(times.reduce((a, b) => a + b) / 4)}ms</div>
            </div>
          );
        }
        break;

      case 'traceroute':
      case 'tracert':
        if (!args[1]) {
          output = 'Usage: traceroute <hostname>';
        } else {
          const host = args[1];
          output = (
            <div>
              <div>Tracing route to {host}</div>
              <div>over a maximum of 30 hops:</div>
              <div className="mt-2">
                <div>  1    1 ms    1 ms    1 ms  192.168.1.1</div>
                <div>  2    8 ms    7 ms    8 ms  10.0.0.1</div>
                <div>  3   12 ms   11 ms   12 ms  172.16.0.1</div>
                <div>  4   18 ms   17 ms   18 ms  {host}</div>
              </div>
              <div className="mt-2">Trace complete.</div>
            </div>
          );
        }
        break;

      case 'nslookup':
        if (!args[1]) {
          output = 'Usage: nslookup <hostname>';
        } else {
          const host = args[1];
          output = (
            <div>
              <div>Server:  dns.google</div>
              <div>Address:  8.8.8.8</div>
              <div className="mt-2">Non-authoritative answer:</div>
              <div>Name:    {host}</div>
              <div>Address:  {Math.floor(Math.random() * 256)}.{Math.floor(Math.random() * 256)}.{Math.floor(Math.random() * 256)}.{Math.floor(Math.random() * 256)}</div>
            </div>
          );
        }
        break;

      case 'curl':
      case 'wget':
        if (!args[1]) {
          output = `Usage: ${command} <url>`;
        } else {
          const url = args[1];
          output = (
            <div>
              <div className="text-cyan-400">Connecting to {url}...</div>
              <div className="text-green-400">HTTP/1.1 200 OK</div>
              <div className="text-zinc-500">Content-Type: text/html</div>
              <div className="mt-2">&lt;!DOCTYPE html&gt;</div>
              <div>&lt;html&gt;&lt;head&gt;&lt;title&gt;Example&lt;/title&gt;&lt;/head&gt;</div>
              <div>&lt;body&gt;Hello World&lt;/body&gt;&lt;/html&gt;</div>
            </div>
          );
        }
        break;

      case 'ipconfig':
      case 'ifconfig':
        output = (
          <div>
            <div className="font-bold mb-2">Windows IP Configuration</div>
            <div className="mb-2">
              <div className="text-cyan-400">Ethernet adapter Ethernet:</div>
              <div className="ml-4">
                <div>Connection-specific DNS Suffix . : local</div>
                <div>Link-local IPv6 Address . . . . : fe80::1234:5678:90ab:cdef</div>
                <div>IPv4 Address. . . . . . . . . . : 192.168.1.{Math.floor(Math.random() * 254) + 1}</div>
                <div>Subnet Mask . . . . . . . . . . : 255.255.255.0</div>
                <div>Default Gateway . . . . . . . . : 192.168.1.1</div>
              </div>
            </div>
            <div>
              <div className="text-cyan-400">Wireless LAN adapter Wi-Fi:</div>
              <div className="ml-4">
                <div>Connection-specific DNS Suffix . : </div>
                <div>IPv4 Address. . . . . . . . . . : 192.168.1.{Math.floor(Math.random() * 254) + 1}</div>
                <div>Subnet Mask . . . . . . . . . . : 255.255.255.0</div>
                <div>Default Gateway . . . . . . . . : 192.168.1.1</div>
              </div>
            </div>
          </div>
        );
        break;

      case 'netstat':
        output = (
          <div>
            <div className="text-cyan-400">Active Connections</div>
            <div className="grid grid-cols-4 gap-4 mt-2 font-bold">
              <span>Proto</span><span>Local Address</span><span>Foreign Address</span><span>State</span>
            </div>
            {[
              { proto: 'TCP', local: '0.0.0.0:80', foreign: '0.0.0.0:0', state: 'LISTENING' },
              { proto: 'TCP', local: '0.0.0.0:443', foreign: '0.0.0.0:0', state: 'LISTENING' },
              { proto: 'TCP', local: '192.168.1.5:52341', foreign: '142.250.80.46:443', state: 'ESTABLISHED' },
              { proto: 'TCP', local: '192.168.1.5:52342', foreign: '20.190.151.68:443', state: 'ESTABLISHED' },
            ].map((conn, i) => (
              <div key={i} className="grid grid-cols-4 gap-4">
                <span>{conn.proto}</span>
                <span>{conn.local}</span>
                <span>{conn.foreign}</span>
                <span className={conn.state === 'ESTABLISHED' ? 'text-green-400' : 'text-yellow-400'}>{conn.state}</span>
              </div>
            ))}
          </div>
        );
        break;

      case 'df':
        output = (
          <div>
            <div className="grid grid-cols-6 gap-2 font-bold text-cyan-400">
              <span>Filesystem</span><span>Size</span><span>Used</span><span>Avail</span><span>Use%</span><span>Mounted on</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              <span>C:</span><span>512G</span><span>156G</span><span>356G</span><span>30%</span><span>/</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              <span>D:</span><span>1.0T</span><span>423G</span><span>577G</span><span>42%</span><span>/data</span>
            </div>
          </div>
        );
        break;

      case 'free':
        output = (
          <div>
            <div className="grid grid-cols-7 gap-2 font-bold text-cyan-400">
              <span></span><span>total</span><span>used</span><span>free</span><span>shared</span><span>buff/cache</span><span>available</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              <span>Mem:</span><span>16384</span><span>8192</span><span>4096</span><span>256</span><span>4096</span><span>7936</span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              <span>Swap:</span><span>8192</span><span>512</span><span>7680</span><span></span><span></span><span></span>
            </div>
          </div>
        );
        break;

      case 'top':
      case 'htop':
        output = (
          <div>
            <div className="text-cyan-400 mb-2">top - {new Date().toLocaleTimeString()} up {Math.floor(Math.random() * 24)}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')}</div>
            <div className="text-yellow-400 mb-2">Tasks: 142 total, 2 running, 140 sleeping</div>
            <div className="text-green-400 mb-2">%Cpu(s): 12.5 us, 3.2 sy, 0.0 ni, 84.0 id</div>
            <div className="text-blue-400 mb-2">MiB Mem: 16384 total, 4096 free, 8192 used</div>
            <div className="grid grid-cols-6 gap-2 font-bold mt-2">
              <span>PID</span><span>USER</span><span>%CPU</span><span>%MEM</span><span>TIME+</span><span>COMMAND</span>
            </div>
            {[
              { pid: 1, user: 'SYSTEM', cpu: '0.0', mem: '0.1', time: '0:05.23', cmd: 'System' },
              { pid: 4, user: 'Levi', cpu: '2.3', mem: '5.2', time: '1:23.45', cmd: 'explorer' },
              { pid: 1234, user: 'Levi', cpu: '8.7', mem: '4.8', time: '5:12.89', cmd: 'chrome' },
              { pid: 5678, user: 'Levi', cpu: '1.2', mem: '1.5', time: '0:45.67', cmd: 'powershell' },
            ].map((p, i) => (
              <div key={i} className="grid grid-cols-6 gap-2">
                <span>{p.pid}</span><span>{p.user}</span><span>{p.cpu}</span><span>{p.mem}</span><span>{p.time}</span><span>{p.cmd}</span>
              </div>
            ))}
          </div>
        );
        break;

      case 'systeminfo':
        output = (
          <div className="space-y-1">
            <div><span className="text-cyan-400 w-32 inline-block">Host Name:</span> WINDOWS13</div>
            <div><span className="text-cyan-400 w-32 inline-block">OS Name:</span> Windows 13 Concept Edition</div>
            <div><span className="text-cyan-400 w-32 inline-block">OS Version:</span> 10.0.22621 Build 22621</div>
            <div><span className="text-cyan-400 w-32 inline-block">OS Manufacturer:</span> Microsoft Corporation</div>
            <div><span className="text-cyan-400 w-32 inline-block">System Type:</span> x64-based PC</div>
            <div><span className="text-cyan-400 w-32 inline-block">Processor:</span> AMD Ryzen 9 5900X 12-Core</div>
            <div><span className="text-cyan-400 w-32 inline-block">BIOS Version:</span> American Megatrends Inc.</div>
            <div><span className="text-cyan-400 w-32 inline-block">Total RAM:</span> 16,384 MB</div>
            <div><span className="text-cyan-400 w-32 inline-block">Available RAM:</span> {Math.floor(Math.random() * 8000 + 4000)} MB</div>
            <div><span className="text-cyan-400 w-32 inline-block">Virtual Memory:</span> 32,768 MB</div>
            <div><span className="text-cyan-400 w-32 inline-block">System Uptime:</span> {Math.floor(Math.random() * 72)} hours</div>
            <div><span className="text-cyan-400 w-32 inline-block">Network Card:</span> Intel I225-V</div>
            <div><span className="text-cyan-400 w-32 inline-block">Hyper-V:</span> Enabled</div>
          </div>
        );
        break;

      case 'tasklist':
      case 'ps':
        const processes = [
          { name: 'System', pid: 4, session: 'Services', mem: '0.1 MB' },
          { name: 'smss.exe', pid: 312, session: 'Services', mem: '1.2 MB' },
          { name: 'csrss.exe', pid: 448, session: 'Services', mem: '4.5 MB' },
          { name: 'wininit.exe', pid: 532, session: 'Services', mem: '2.3 MB' },
          { name: 'services.exe', pid: 628, session: 'Services', mem: '8.7 MB' },
          { name: 'lsass.exe', pid: 648, session: 'Services', mem: '15.2 MB' },
          { name: 'svchost.exe', pid: 892, session: 'Services', mem: '12.3 MB' },
          { name: 'dwm.exe', pid: 1456, session: 'Console', mem: '45.2 MB' },
          { name: 'explorer.exe', pid: 1234, session: 'Console', mem: '85.4 MB' },
          { name: 'powershell.exe', pid: 5678, session: 'Console', mem: '67.8 MB' },
          { name: 'chrome.exe', pid: 2345, session: 'Console', mem: '256.4 MB' },
          { name: 'code.exe', pid: 3456, session: 'Console', mem: '312.7 MB' },
          { name: 'spotify.exe', pid: 4567, session: 'Console', mem: '189.3 MB' },
          { name: 'discord.exe', pid: 6789, session: 'Console', mem: '156.8 MB' },
          { name: 'windows13.exe', pid: 9012, session: 'Console', mem: '128.5 MB' },
        ];
        output = (
          <div>
            <div className="grid grid-cols-4 gap-4 text-cyan-400 font-bold border-b border-zinc-600 pb-1 mb-1">
              <span>Image Name</span>
              <span>PID</span>
              <span>Session</span>
              <span>Memory</span>
            </div>
            {processes.map((p, i) => (
              <div key={i} className="grid grid-cols-4 gap-4">
                <span>{p.name}</span>
                <span>{p.pid}</span>
                <span>{p.session}</span>
                <span>{p.mem}</span>
              </div>
            ))}
          </div>
        );
        break;

      case 'kill':
      case 'taskkill':
        if (!args[1]) {
          output = 'Usage: kill <pid>';
        } else {
          output = `SUCCESS: The process with PID ${args[1]} has been terminated.`;
        }
        break;

      case 'jobs':
        output = '[1]+  Running                 background_task &';
        break;

      case 'history':
        output = (
          <div>
            {commandHistory.map((cmd, i) => (
              <div key={i}><span className="text-zinc-500 w-6 inline-block">{i + 1}</span> {cmd}</div>
            ))}
          </div>
        );
        break;

      case 'cowsay':
        const cowText = args.slice(1).join(' ') || 'Moo!';
        const lineLength = Math.min(cowText.length, 40);
        output = (
          <pre className="text-yellow-400">{`
 ${'_'.repeat(lineLength + 2)}
< ${cowText.padEnd(lineLength)} >
 ${'-'.repeat(lineLength + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
          `}</pre>
        );
        break;

      case 'fortune':
        const fortunes = [
          'A journey of a thousand miles begins with a single step.',
          'The best time to plant a tree was 20 years ago. The second best time is now.',
          'Your code will compile on the first try today!',
          'A bug in the hand is worth two in production.',
          'May your coffee be strong and your bugs be weak.',
          'Today is a good day to refactor.',
          'You will find the semicolon you were looking for.',
          'The best error message is the one that never shows up.',
          'Code is like humor. When you have to explain it, it\'s bad.',
          'First, solve the problem. Then, write the code.',
          'Simplicity is the soul of efficiency.',
          'Any fool can write code that a computer can understand.',
          'Talk is cheap. Show me the code. - Linus Torvalds',
          'There are only two hard things in CS: cache invalidation and naming things.',
        ];
        output = fortunes[Math.floor(Math.random() * fortunes.length)];
        break;

      case 'joke':
        const jokes = [
          { q: 'Why do programmers prefer dark mode?', a: 'Because light attracts bugs!' },
          { q: 'Why do Java developers wear glasses?', a: 'Because they don\'t C#!' },
          { q: 'A SQL query walks into a bar, walks up to two tables and asks...', a: '"Can I join you?"' },
          { q: 'Why do programmers hate nature?', a: 'It has too many bugs!' },
          { q: 'What\'s a programmer\'s favorite hangout place?', a: 'Foo Bar!' },
          { q: 'Why was the JavaScript developer sad?', a: 'Because he didn\'t Node how to Express himself!' },
          { q: '!false', a: 'It\'s funny because it\'s true.' },
          { q: 'How many programmers does it take to change a light bulb?', a: 'None, that\'s a hardware problem!' },
        ];
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        output = (
          <div>
            <div className="text-cyan-400">{joke.q}</div>
            <div className="text-yellow-400 mt-1">{joke.a}</div>
          </div>
        );
        break;

      case 'weather':
        const city = args.slice(1).join(' ') || 'Amsterdam';
        const temp = Math.floor(Math.random() * 30) - 5;
        const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy', 'Windy'];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        output = (
          <div>
            <div className="text-cyan-400 font-bold mb-2">Weather for {city}</div>
            <div className="flex gap-8">
              <pre className="text-yellow-400">{condition === 'Sunny' ? `
    \\   /
     .-.
  ‒ (   ) ‒
     \`-᾿
    /   \\
              ` : condition === 'Rainy' ? `
     .-.
    (   ).
   (___(__)
    ʻ ʻ ʻ ʻ
   ʻ ʻ ʻ ʻ
              ` : `
     .--.
  .-(    ).
 (___.__)__)
              `}</pre>
              <div>
                <div className="text-2xl font-bold">{temp}°C</div>
                <div className="text-muted-foreground">{condition}</div>
                <div className="text-sm mt-2">
                  <div>Humidity: {Math.floor(Math.random() * 50) + 30}%</div>
                  <div>Wind: {Math.floor(Math.random() * 30)} km/h</div>
                </div>
              </div>
            </div>
          </div>
        );
        break;

      case 'matrix':
        output = (
          <div className="text-green-400 font-mono text-xs leading-tight animate-pulse">
            {Array(5).fill(null).map((_, i) => (
              <div key={i}>
                {Array(60).fill(null).map(() => 
                  String.fromCharCode(0x30A0 + Math.random() * 96)
                ).join('')}
              </div>
            ))}
          </div>
        );
        break;

      case 'cmatrix':
        output = (
          <div className="text-green-500 font-mono text-xs leading-tight">
            <div className="animate-pulse">
              {Array(8).fill(null).map((_, i) => (
                <div key={i} className="flex">
                  {Array(70).fill(null).map((_, j) => (
                    <span 
                      key={j} 
                      style={{ 
                        opacity: Math.random(),
                        color: Math.random() > 0.9 ? '#ffffff' : undefined
                      }}
                    >
                      {String.fromCharCode(0x30A0 + Math.random() * 96)}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <div className="text-zinc-500 mt-2">(Use Ctrl+C to stop in real cmatrix)</div>
          </div>
        );
        break;

      case 'figlet':
        const figText = args.slice(1).join(' ') || 'Hello';
        output = (
          <pre className="text-cyan-400">{`
  _   _      _ _       
 | | | | ___| | | ___  
 | |_| |/ _ \\ | |/ _ \\ 
 |  _  |  __/ | | (_) |
 |_| |_|\\___|_|_|\\___/ 
                       
          `.replace('Hello', figText.substring(0, 10))}</pre>
        );
        break;

      case 'lolcat':
        const lolText = args.slice(1).join(' ') || 'Rainbow text!';
        const colors = ['text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400', 'text-blue-400', 'text-purple-400'];
        output = (
          <div className="flex">
            {lolText.split('').map((char, i) => (
              <span key={i} className={colors[i % colors.length]}>{char}</span>
            ))}
          </div>
        );
        break;

      case 'sl':
        output = <SteamLocomotive />;
        break;

      case 'aquarium':
        output = (
          <pre className="text-cyan-400">{`
    .'"'.        ___,,,___        .'""'.
   : (\`') ;    .'         '.    ; ('') :
    '..'    /  O        O  \\    '..'
           |                 |
           |     \\____/     |
            \\              /
             '.__      __.'
                 '----'

   ><>  ><>  <><  ><>  <><  ><>  <><
       ~~ ~~~  ~~~~ ~~~ ~~~~ ~~~~
          `}</pre>
        );
        break;

      case 'neofetch':
        output = (
          <div className="flex gap-6 my-2">
            <pre className="text-cyan-400 text-xs">{`
    ████████████████
  ██                ██
██    ██████████    ██
██    ██      ██    ██
██    ██████████    ██
██                  ██
██    ██████████    ██
██    ██      ██    ██
██    ██████████    ██
  ██                ██
    ████████████████
            `}</pre>
            <div className="flex flex-col justify-center gap-0.5 text-sm">
              <div className="font-bold text-cyan-400">{env.USERNAME}@{env.COMPUTERNAME.toLowerCase()}</div>
              <div className="h-px bg-zinc-600 w-full my-1" />
              <div><span className="text-cyan-400 font-bold">OS</span>: Windows 13 Concept x64</div>
              <div><span className="text-cyan-400 font-bold">Host</span>: Windows 13 Simulator</div>
              <div><span className="text-cyan-400 font-bold">Kernel</span>: 10.0.22621</div>
              <div><span className="text-cyan-400 font-bold">Uptime</span>: {Math.floor(Math.random() * 60)} mins</div>
              <div><span className="text-cyan-400 font-bold">Packages</span>: 156 (winget)</div>
              <div><span className="text-cyan-400 font-bold">Shell</span>: PowerShell 7.4</div>
              <div><span className="text-cyan-400 font-bold">Resolution</span>: {window.innerWidth}x{window.innerHeight}</div>
              <div><span className="text-cyan-400 font-bold">DE</span>: Fluent</div>
              <div><span className="text-cyan-400 font-bold">WM</span>: Desktop Window Manager</div>
              <div><span className="text-cyan-400 font-bold">Theme</span>: Windows 13 Dark</div>
              <div><span className="text-cyan-400 font-bold">Terminal</span>: Windows Terminal</div>
              <div><span className="text-cyan-400 font-bold">CPU</span>: AMD Ryzen 9 5900X</div>
              <div><span className="text-cyan-400 font-bold">GPU</span>: NVIDIA GeForce RTX 3080</div>
              <div><span className="text-cyan-400 font-bold">Memory</span>: {Math.floor(Math.random() * 8000 + 4000)} MiB / 16384 MiB</div>
              <div className="flex gap-1 mt-2">
                <div className="w-3 h-3 bg-black rounded-sm" />
                <div className="w-3 h-3 bg-red-500 rounded-sm" />
                <div className="w-3 h-3 bg-green-500 rounded-sm" />
                <div className="w-3 h-3 bg-yellow-500 rounded-sm" />
                <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                <div className="w-3 h-3 bg-purple-500 rounded-sm" />
                <div className="w-3 h-3 bg-cyan-500 rounded-sm" />
                <div className="w-3 h-3 bg-white rounded-sm" />
              </div>
            </div>
          </div>
        );
        break;

      case 'timer':
        if (!args[1]) {
          output = 'Usage: timer <seconds>';
        } else {
          const seconds = parseInt(args[1]) || 10;
          output = `Timer set for ${seconds} seconds. (This is a demo - timer would count down in a real terminal)`;
        }
        break;

      case 'sleep':
        if (!args[1]) {
          output = 'Usage: sleep <seconds>';
        } else {
          output = `Sleeping for ${args[1]} seconds... Done!`;
        }
        break;

      case 'exit':
      case 'logout':
        output = 'Logout... (Terminal would close here)';
        break;

      case 'reset':
        setHistory([{ input: '', output: 'Terminal reset.\n\nWindows 13 PowerShell\nType "help" for available commands.', path: '' }]);
        return;

      case '':
        break;

      default:
        // Check if it's trying to run a file
        if (command.endsWith('.exe') || command.endsWith('.bat') || command.endsWith('.ps1')) {
          output = `Executing ${command}...`;
        } else {
          output = `'${command}' is not recognized as an internal or external command,\noperable program or batch file. Type 'help' for available commands.`;
        }
    }

    setHistory([...history, { input: cmd, output, path: currentPath }]);
    setCurrentInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Basic tab completion for commands
      const commands = ['help', 'clear', 'ls', 'cd', 'pwd', 'cat', 'mkdir', 'touch', 'rm', 'echo', 'whoami', 'hostname', 'date', 'env', 'neofetch', 'tree', 'calc', 'ping', 'ipconfig', 'systeminfo', 'tasklist', 'history', 'cowsay', 'fortune', 'matrix', 'weather', 'joke', 'figlet', 'lolcat', 'grep', 'find', 'curl', 'wget'];
      const matches = commands.filter(c => c.startsWith(currentInput.toLowerCase()));
      if (matches.length === 1) {
        setCurrentInput(matches[0]);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      setHistory([...history, { input: currentInput + '^C', output: '', path: currentPath }]);
      setCurrentInput('');
    }
  };

  return (
    <div 
      className="h-full w-full bg-[#0C0C0C] text-zinc-200 font-mono text-sm p-3 overflow-auto flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((entry, i) => (
        <div key={i} className="mb-2">
          {entry.input && (
            <div className="flex gap-2">
              <span className="text-blue-400">PS {entry.path}&gt;</span>
              <span className="text-white">{entry.input}</span>
            </div>
          )}
          {entry.output && (
            <div className="whitespace-pre-wrap text-zinc-300 mt-1">
              {entry.output}
            </div>
          )}
        </div>
      ))}
      
      <div className="flex gap-2 items-center">
        <span className="text-blue-400 whitespace-nowrap">PS {currentPath}&gt;</span>
        <input 
          ref={inputRef}
          type="text" 
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent outline-none border-none w-full text-white"
          autoFocus
          spellCheck={false}
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
