import { useState } from 'react';
import { Lock, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useThemeStore } from '@/store/useThemeStore';

export const ResetPassword = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === confirm) {
      console.log('Password successfully reset!');
    } else {
      console.error('Passwords do not match!');
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        theme === 'dark' ? 'bg-background' : 'bg-background'
      }`}
    >
      <Card
        className={`w-full max-w-md shadow-lg ${
          theme === 'dark'
            ? 'bg-background0 text-white'
            : 'bg-background text-gray-900'
        }`}
      >
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">
            Reset Password
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="rounded-full p-2"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}

            <div className="w-full rounded-md border focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <div className="relative flex items-center w-full bg-background">
                {/* Left lock icon */}
                <Lock className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />

                {/* Input field */}
                <Input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="New Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 border-0 focus:ring-0 focus-visible:ring-0"
                />

                {/* Right eye icon */}
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 text-muted-foreground"
                >
                  {showPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="w-full rounded-md border focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <div className="relative flex items-center w-full bg-background">
                {/* Left lock icon */}
                <Lock className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />

                {/* Input field */}
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  className="w-full pl-10 pr-10 border-0 focus:ring-0 focus-visible:ring-0"
                />

                {/* Right eye icon */}
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 text-muted-foreground"
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className={`w-full ${
                theme === 'dark'
                  ? 'bg-[#F7845D] hover:bg-[#FA6657] text-white'
                  : 'bg-[#137657] hover:bg-[#248378] text-white'
              }`}
            >
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
