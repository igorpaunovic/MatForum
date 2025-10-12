import createApi from "@/shared/api/api-factory";
import type { UserProfile, CreateUserProfileDto, UpdateUserProfileDto } from "@/lib/types.ts";

const userProfileApi = createApi({ commonPrefix: "users" });

const getUserProfile = async (id: string): Promise<UserProfile | null> => {
    try {
        const response = await userProfileApi.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
};

const getAllUserProfiles = async (): Promise<UserProfile[]> => {
    try {
        const response = await userProfileApi.get('');
        return response.data;
    } catch (error) {
        console.error('Error fetching all user profiles:', error);
        return [];
    }
};

const createUserProfile = async (userProfile: CreateUserProfileDto): Promise<UserProfile> => {
    const response = await userProfileApi.post('', userProfile);
    return response.data;
};

const updateUserProfile = async (id: string, userProfile: UpdateUserProfileDto): Promise<UserProfile | null> => {
    try {
        const response = await userProfileApi.patch(`/${id}`, userProfile);
        return response.data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        return null;
    }
};

const deleteUserProfile = async (id: string): Promise<boolean> => {
    try {
        await userProfileApi.delete(`/${id}`);
        return true;
    } catch (error) {
        console.error('Error deleting user profile:', error);
        return false;
    }
};

const checkUserExists = async (id: string): Promise<boolean> => {
    try {
        await userProfileApi.get(`/${id}/exists`);
        return true;
    } catch (error) {
        return false;
    }
};

const userProfileService = {
    getUserProfile,
    getAllUserProfiles,
    createUserProfile,
    updateUserProfile,
    deleteUserProfile,
    checkUserExists
};

export default userProfileService;
