import { Repo } from './Repo'
import { PullRequest } from './PullRequest'

export default interface ReposWithPullRequests {
    repo : Repo,
    pullRequests : PullRequest[]
}