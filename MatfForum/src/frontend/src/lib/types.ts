export interface Question {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdByUserId: string; // ✅ Match backend field name
  createdAt: string;
  updatedAt: string;
  tags: string[];
  views: number; // ✅ Match backend field name
  isClosed: boolean;
}

export interface CreateQuestionDTO {
  title: string;
  content: string;
  tags: string[];
  createdByUserId: string;
}

export interface Answer {
  id: string;
  content: string;
  questionId: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  replies?: Answer[];
  parentAnswerId?: string;
}

export interface CreateAnswerRequest {
  content: string;
  questionId: string;
  userId: string;
  parentAnswerId?: string;
}

// UserProfile types
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserProfileDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber: string;
  dateOfBirth: string;
}

export interface UpdateUserProfileDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  dateOfBirth?: string;
}