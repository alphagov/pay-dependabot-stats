import {User} from './User';

export interface Status {
        url: string,
        avatar_url: string,
        id: number,
        node_id: string,
        state: string,
        description: string,
        target_url: string,
        context: string,
        created_at: string,
        updated_at: string,
        creator: User
}