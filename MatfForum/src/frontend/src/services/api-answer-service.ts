import createApi from "@/shared/api/api-factory";
import type { Answer, CreateAnswerRequest } from "@/lib/types";

const answerApi = createApi({ commonPrefix: "answers" });

const createAnswer = async (request: CreateAnswerRequest): Promise<{ answerId: string }> => {
    return await answerApi.post('', request).then((res) => {
        return res.data;
    });
}

const getAnswersByQuestionId = async (questionId: string): Promise<Answer[]> => {
    return await answerApi.get(`by-question/${questionId}`).then((res) => {
        return res.data;
    });
}

const getAnswerById = async (answerId: string): Promise<Answer> => {
    return await answerApi.get(`${answerId}`).then((res) => {
        return res.data;
    });
}

const updateAnswer = async (answerId: string, content: string): Promise<{ answerId: string }> => {
    return await answerApi.put(`${answerId}`, { content }).then((res) => {
        return res.data;
    });
}

const deleteAnswer = async (answerId: string): Promise<void> => {
    return await answerApi.delete(`${answerId}`).then((res) => {
        return res.data;
    });
}

const answerService = {
    createAnswer,
    getAnswersByQuestionId,
    getAnswerById,
    updateAnswer,
    deleteAnswer
};

export default answerService;

