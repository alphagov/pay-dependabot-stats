import { Repo } from "./Repo";

export interface Repos {
    total_count: number,
    incomplete_results: boolean,
    items: Repo[]
}