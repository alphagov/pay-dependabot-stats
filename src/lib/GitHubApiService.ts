import { PullRequest } from "../types/PullRequest";
import { Repos } from "../types/Repos";
import { Repo } from "../types/Repo";

export class GithubApiService {
    constructor() {}

    public async getPullRequests() : Promise<void> {
        var dependabotPulls : PullRequest[] = [];
        const repos = await fetch('https://api.github.com/search/repositories?q=pay+org:alphagov')
        const reposJson : Repos = await repos.json();
        reposJson.items.forEach(
            x => {
                console.log(x.pulls_url)
            })
    }

}