export interface Question {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  tags?: string[];
  votes?: number;
}

export interface VoteSummary {
  questionId: string;
  upvotes: number;
  downvotes: number;
  totalVotes: number;
  userVote: number | null; // 1 = Upvote, -1 = Downvote, null = no vote
}