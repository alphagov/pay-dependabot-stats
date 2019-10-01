import { PullRequest } from "../types/PullRequest";
import { Repos } from "../types/Repos";
import { Repo } from "../types/Repo";
import apiKey from "../Secret";

export class GithubApiService {

    public async getPullRequests() : Promise<PullRequest[]> {
        const returnedPulls : PullRequest[] = []
        const headers : Headers = new Headers({
            'Authorization' : 'token ' + apiKey
        })
        const repos : Response = await fetch('https://api.github.com/search/repositories?q=pay+org:alphagov', {
            headers: headers
        })
        const reposJson : Repos = await repos.json();
        for(const repo of reposJson.items) {
            const pulls = await this.processRepo(repo)
            for(const pull of pulls) {
                returnedPulls.push(pull);
            }
        }
        return returnedPulls;
    }

    private async processRepo(repo : Repo) : Promise<PullRequest[]> {
        var processedPulls : PullRequest[] = []
        const pulls = await fetch(repo.pulls_url.slice(0, repo.pulls_url.length-9))
        const pullsJson : PullRequest[] = await pulls.json();
        for(const pull of pullsJson) {
            if(this.processPullRequest(pull)) {
                processedPulls.push(pull);
            }
        }
        return processedPulls;
    }

    private processPullRequest(pullRequest : PullRequest) : boolean {
        return pullRequest.user.login.includes('dependabot')
    }
}