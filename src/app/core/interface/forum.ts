import { Comments } from './comments';

export interface Forum {
    id?: number;
    description: string;
    fullname: string;
    nickname: string;
    at: string;
    edited: boolean;
    comments: Comments;
}
