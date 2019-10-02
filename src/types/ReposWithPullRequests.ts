import { Repo } from './Repo'
import { PullRequest } from './PullRequest'

export interface ReposWithPullRequests {
    repo : Repo,
    pullRequests : PullRequest[]
}