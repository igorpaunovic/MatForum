import { useQuery } from "@tanstack/react-query";
import questionService from "@/services/api-question-service";

export const useSearchQuestions = (searchTerm: string) => {
    return useQuery({
        queryKey: ["questions", "search", searchTerm],
        queryFn: () => questionService.searchQuestions(searchTerm),
        enabled: !!searchTerm && searchTerm.length > 0, // samo pretraži ako postoji search term
        staleTime: 1000 * 60 * 5, // 5 minuta
    });
};

