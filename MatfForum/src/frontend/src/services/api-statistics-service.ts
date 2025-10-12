import createApi from "@/shared/api/api-factory";

const questionsApi = createApi({ commonPrefix: "questions" });
const answersApi = createApi({ commonPrefix: "answers" });
const usersApi = createApi({ commonPrefix: "users" });

export interface Statistics {
    questionsCount: number;
    answersCount: number;
    membersCount: number;
}

const getQuestionsCount = async (): Promise<number> => {
    return await questionsApi.get('/count').then((res) => {
        return res.data;
    });
};

const getAnswersCount = async (): Promise<number> => {
    return await answersApi.get('/count').then((res) => {
        return res.data;
    });
};

const getMembersCount = async (): Promise<number> => {
    return await usersApi.get('/count').then((res) => {
        return res.data;
    });
};

const getAllStatistics = async (): Promise<Statistics> => {
    const [questionsCount, answersCount, membersCount] = await Promise.all([
        getQuestionsCount(),
        getAnswersCount(),
        getMembersCount()
    ]);

    return {
        questionsCount,
        answersCount,
        membersCount
    };
};

const statisticsService = {
    getQuestionsCount,
    getAnswersCount,
    getMembersCount,
    getAllStatistics
};

export default statisticsService;

