export interface User {
    email: string;
    nickname: string;
    password: string;
    scores: number[];
    playedQuizzes: string[];
}