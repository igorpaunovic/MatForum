import createApi from "@/shared/api/api-factory";
import type { CreateQuestionDTO, Question } from "@/lib/types.ts";

const questionApi = createApi({ commonPrefix: "questions" });

// ovde treba umesto res.data treba da bude zod schema 
// QuestionsResponseSchema.parse(res.data), za sad je ovako samo zbog testiranja 
const getQuestions = async (): Promise<Question[]> => {
    return await questionApi.get('').then( (res) => {
        return res.data;
    })
}

const searchQuestions = async (searchTerm: string) => {
    return await questionApi.get('/search', {
        params: { searchTerm }
    }).then((res) => {
        return res.data;
    })
}

const createQuestion = async (question: CreateQuestionDTO): Promise<Question> => {
    return await questionApi.post('', question).then( (res) => {
        return res.data;
    })
}

const questionService = {
    getQuestions,
    searchQuestions,
    createQuestion
};

export default questionService;
export const questionsConfigKey = "questionConfig";
