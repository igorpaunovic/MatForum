import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <Sun className="h-4 w-4 text-gray-700 dark:text-[#818384]" />
      <Switch
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
      />
      <Moon className="h-4 w-4 text-gray-700 dark:text-[#D7DADC]" />
    </div>
  );
};

