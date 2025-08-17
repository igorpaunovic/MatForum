import { useQuery } from "@tanstack/react-query";

import apiConfigService, { questionsConfigKey } from "@/services/api-question-service";

const useGetQuestions = () => {
  return useQuery({
    queryKey: [questionsConfigKey],
    queryFn: () => apiConfigService.getQuestions(),
  });
};

export default useGetQuestions;