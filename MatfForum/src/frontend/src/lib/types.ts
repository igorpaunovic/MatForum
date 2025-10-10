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

export interface Answer {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  questionId: string;
  authorId: string;
  authorName?: string;
  parentAnswerId?: string | null;
  replies?: Answer[]; // Nested replies for threaded view
}

export interface CreateAnswerRequest {
  content: string;
  questionId: string;
  userId: string;
  parentAnswerId?: string | null; // For nested replies
}