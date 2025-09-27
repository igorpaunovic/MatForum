export interface Question {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
  tags?: string[];
  votes?: number;
}