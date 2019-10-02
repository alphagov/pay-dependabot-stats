import React, { Component } from "react";
import { GithubApiService } from "../lib/GitHubApiService";
import { PullRequest } from "../types/PullRequest";
import PRContainer from "./PRContainer";
import "./StatisticsContainer.css"
import { ReposWithPullRequests } from "../types/ReposWithPullRequests";
import RepoStatsContainer from "./RepoStatsContainer";

type StatisticsProps = {
  githubApiService?: GithubApiService;
  dependabotPulls?: PullRequest[];
  dependabotReposWithPullRequests? : ReposWithPullRequests[]
};

type StatisticsPropsState = {
  githubApiService: GithubApiService;
  dependabotReposWithPullRequests: ReposWithPullRequests[];
  dependabotPullRequests: PullRequest[];
};

class StatisticsContainer extends Component<
  StatisticsProps,
  StatisticsPropsState
> {
  githubApiService: GithubApiService;
  dependabotPullRequests: PullRequest[];
  dependabotReposWithPullRequests: ReposWithPullRequests[];

  constructor(props: StatisticsProps) {
    super(props);
    this.githubApiService = new GithubApiService();
    this.dependabotPullRequests = [];
    this.dependabotReposWithPullRequests = [];
    this.state = {
      dependabotReposWithPullRequests: this.dependabotReposWithPullRequests,
      dependabotPullRequests: this.dependabotPullRequests,
      githubApiService: this.githubApiService
    };
  }

  collapsePullRequests(dependabotReposWithPullRequests: ReposWithPullRequests[]) : PullRequest[] {
    return dependabotReposWithPullRequests.flatMap(x => x.pullRequests);
  }

  async componentDidMount() {
    const prsByRepo = await this.githubApiService.getPrsByRepo()
    this.setState({
      dependabotReposWithPullRequests: prsByRepo,
      dependabotPullRequests: this.collapsePullRequests(prsByRepo)
    });
  }

  renderPull(state: StatisticsPropsState) {
    if (state.dependabotPullRequests[0]) {
    const securityPulls : PullRequest[] = state.dependabotPullRequests
    .filter(x => this.containsSecurityLabel(x))
    .sort(function (a, b) { return new Date(a.created_at).getTime() - new Date(b.created_at).getTime() })
    .slice(0,3)
      return (
        <div>
          {securityPulls.map(x => {
            return <PRContainer pullRequest={x}/>
          })}
        </div>
      );
    }
  }

  renderRepos(state: StatisticsPropsState) {
    if (state.dependabotPullRequests[0]) {
      return (
        <RepoStatsContainer repos={this.state.dependabotReposWithPullRequests}/>
      )
    }
  }

  containsSecurityLabel(pull : PullRequest) : boolean{
    for(const label of pull.labels) {
      if(label.name === "security") {
        return true;
      }
    }
    return false;
  }

  render() {
    return (
      <div className="parent">
      <div className="horizontal-centered">
        <div className="alignment">
          <h1 className="vertical-centered pr-number-text">{this.state.dependabotPullRequests.length}</h1>          
        </div>
      </div>
      <div className="horizontal-centered">
        {this.renderPull(this.state)}
        {this.renderRepos(this.state)}
      </div>
      </div>
    );
  }
}

export default StatisticsContainer;
