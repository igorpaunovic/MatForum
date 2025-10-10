import { User, LogOut, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMe } from "@/api/auth";
import { useLogout } from "@/routes/~(public)/~_auth/~login/api/login-email";
import { toast } from "sonner";

export const SimpleUserMenu = () => {
  const { data: user, isLoading } = useMe();
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate({ to: "/" });
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex items-center gap-3 min-w-0 h-full">
      {isLoading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : user ? (
        <>
          <div className="flex items-center gap-2 text-sm text-gray-600 h-full">
            <User className="h-4 w-4" />
            <span className="font-medium truncate">{user.firstName} {user.lastName}</span>
          </div>
          {/* User Dropdown using proper UI component */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center gap-1 shrink-0 h-8">
                <span className="text-sm">My Account</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48" sideOffset={5}>
              <DropdownMenuLabel>
                <div className="font-medium">{user.firstName} {user.lastName}</div>
                <div className="text-xs text-gray-500 font-normal">{user.email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex cursor-pointer items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} disabled={logoutMutation.isPending}>
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link to="/login" className="flex cursor-pointer items-center">
                <User className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/signup" className="flex cursor-pointer items-center">
                <User className="mr-2 h-4 w-4" />
                Sign Up
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};