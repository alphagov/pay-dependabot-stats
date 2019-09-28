import { Repo } from "./Repo";
import { User } from "./User";

export interface Commit {
    label: string,
    ref: string,
    sha: string,
    user: User,
    repo: Repo
}