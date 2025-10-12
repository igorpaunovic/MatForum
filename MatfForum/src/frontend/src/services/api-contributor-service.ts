import createApi from "@/shared/api/api-factory";

const usersApi = createApi({ commonPrefix: "users" });

export interface TopContributor {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    createdAt: string;
    questionsCount: number;
    answersCount: number;
    totalContributions: number;
}

export interface ContributorQuestion {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    views: number;
    tags: string[];
}

export interface ContributorProfile {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    dateOfBirth: string;
    createdAt: string;
    questionsCount: number;
    answersCount: number;
    totalContributions: number;
    questions: ContributorQuestion[];
}

const getTopContributors = async (count: number = 10): Promise<TopContributor[]> => {
    return await usersApi.get(`/top-contributors?count=${count}`).then((res) => {
        return res.data;
    });
};

const getContributorProfile = async (userId: string): Promise<ContributorProfile> => {
    return await usersApi.get(`/${userId}/contributor-profile`).then((res) => {
        return res.data;
    });
};

const contributorService = {
    getTopContributors,
    getContributorProfile
};

export default contributorService;

