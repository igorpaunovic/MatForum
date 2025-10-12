import { useMe } from "@/api/auth";
import { useLogout } from "@/routes/~(public)/~_auth/~login/api/login-email";
import { Button } from "@/components/ui/button";

export const UserProfile = () => {
  const { data: user, isLoading, error } = useMe();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isLoading) {
    return <div>Loading user profile...</div>;
  }

  if (error) {
    return <div>Error loading user profile</div>;
  }

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="p-4 border border-gray-200 dark:border-[#343536] rounded-lg bg-white dark:bg-[#1A1A1B]">
      <h2 className="text-xl font-bold mb-2 dark:text-[#D7DADC]">User Profile</h2>
      <div className="space-y-2 dark:text-[#D7DADC]">
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>ID:</strong> {user.id}</p>
      </div>
      <Button 
        onClick={handleLogout} 
        variant="destructive" 
        className="mt-4"
        disabled={logoutMutation.isPending}
      >
        {logoutMutation.isPending ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
};
