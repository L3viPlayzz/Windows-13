import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Trash2, User } from 'lucide-react';

interface ProfileEditorProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentInitials: string;
  currentProfilePicture: string | null;
  onSave: (name: string, initials: string, profilePicture: string | null) => void;
}

export function ProfileEditor({ isOpen, onClose, currentName, currentInitials, currentProfilePicture, onSave }: ProfileEditorProps) {
  const [name, setName] = useState(currentName);
  const [initials, setInitials] = useState(currentInitials);
  const [profilePicture, setProfilePicture] = useState<string | null>(currentProfilePicture);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setInitials(currentInitials);
      setProfilePicture(currentProfilePicture);
    }
  }, [isOpen, currentName, currentInitials, currentProfilePicture]);

  const handleSave = () => {
    onSave(name, initials, profilePicture);
    onClose();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Afbeelding moet kleiner zijn dan 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setProfilePicture(imageUrl);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePicture = () => {
    setProfilePicture(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] glass-panel border-white/20 text-foreground">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              {profilePicture ? (
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-white/20"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold border-2 border-white/20">
                  {initials || 'U'}
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                  title="Upload foto"
                >
                  <Upload className="w-4 h-4 text-white" />
                </button>
                {profilePicture && (
                  <button
                    onClick={handleRemovePicture}
                    className="p-2 bg-red-500/50 hover:bg-red-500/70 rounded-full transition-colors"
                    title="Verwijder foto"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload profielfoto
            </Button>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3 bg-white/5 border-white/10"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="initials" className="text-right">
              Initials
            </Label>
            <Input
              id="initials"
              value={initials}
              onChange={(e) => setInitials(e.target.value)}
              className="col-span-3 bg-white/5 border-white/10"
              maxLength={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
