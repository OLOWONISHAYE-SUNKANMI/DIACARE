import { useState } from "react";
import { Mail, Sun, Moon, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useThemeStore } from "@/store/useThemeStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const ForgotPassword = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // fake success
    toast.success("Email sent!", {
      description: `Password reset link sent to ${email}`,
      duration: 4000,
    });

    console.log("Password reset link sent to:", email);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        theme === "dark" ? "bg-background" : "bg-background"
      }`}
    >
      <Card
        className={`w-full max-w-md shadow-lg ${
          theme === "dark"
            ? "bg-background text-white"
            : "bg-background text-gray-900"
        }`}
      >
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/auth")}
              className="rounded-full p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <CardTitle className="text-xl font-semibold">
              Forgot Password
            </CardTitle>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="rounded-full p-2"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm opacity-80">
              Enter your email address and we’ll send you a link to reset your
              password.
            </p>
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-7 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              className={`w-full ${
                theme === "dark"
                  ? "bg-[#F7845D] hover:bg-[#FA6657] text-white"
                  : "bg-[#137657] hover:bg-[#248378] text-white"
              }`}
            >
              Send Reset Link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
