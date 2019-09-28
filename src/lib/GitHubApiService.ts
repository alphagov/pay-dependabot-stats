import { PullRequest } from "../types/PullRequest";
import { Repos } from "../types/Repos";
import { Repo } from "../types/Repo";
import { eventNames } from "cluster";
import { RateLimitError } from "../types/RateLimitError";

export class GithubApiService {
    dependabotPulls : PullRequest[];

    constructor() {
        this.dependabotPulls = [];
    }

    public async getPullRequests() : Promise<PullRequest[] | RateLimitError> {
        const repos = await fetch('https://api.github.com/search/repositories?q=pay+org:alphagov')
        const reposJson : Repos | RateLimitError = await repos.json();
        if ((reposJson as Repos).items ) {
            (reposJson as Repos).items.forEach(x => this.processRepo(x));
            return this.dependabotPulls;
        } else {
            return (reposJson as RateLimitError)
        }
    }

    private async processRepo(repo : Repo) : Promise<void> {
        const pulls = await fetch(repo.pulls_url.slice(0, repo.pulls_url.length-9))
        const pullsJson : PullRequest[] = await pulls.json();
        pullsJson.forEach(pull => this.processPullRequest(pull))
    }

    private async processPullRequest(pullRequest : PullRequest) : Promise<void> {
        if(pullRequest.user.login.includes('dependabot')) {
            this.dependabotPulls.push(pullRequest)
        }
    }
}