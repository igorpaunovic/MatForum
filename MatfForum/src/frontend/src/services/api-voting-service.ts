import createApi from "@/shared/api/api-factory";

// Voting API pozivi idu preko API Gateway-a (port 5000)
const votingApi = createApi({ commonPrefix: "votes" });

// Vote type constants
export const VOTE_TYPE_UPVOTE = 1;
export const VOTE_TYPE_DOWNVOTE = -1;
export const VOTE_TYPE_NEUTRAL = 0;

export type VoteType = -1 | 0 | 1;

export interface VoteSummary {
  questionId: string;
  upvotes: number;
  downvotes: number;
  totalVotes: number;
  userVote: VoteType | null;
}

export interface VoteCommand {
  questionId: string;
  userId: string;
  voteType: VoteType;
}

const vote = async (command: VoteCommand) => {
  return await votingApi.post('vote', command).then((res) => res.data);
};

const getVoteSummary = async (questionId: string, userId?: string): Promise<VoteSummary> => {
  const params = userId ? { userId } : {};
  return await votingApi.get(`summary/${questionId}`, { params }).then((res) => res.data);
};

const removeVote = async (questionId: string, userId: string) => {
  return await votingApi.delete('remove', { 
    data: { questionId, userId } 
  }).then((res) => res.data);
};

const votingService = {
  vote,
  getVoteSummary,
  removeVote
};

export default votingService;
export const votingConfigKey = "votingConfig";
