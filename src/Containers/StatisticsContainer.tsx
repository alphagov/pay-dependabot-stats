import React, { Component } from "react";
import { GithubApiService } from "../lib/GitHubApiService";
import { PullRequest } from "../types/PullRequest";
import PRContainer from "./PRContainer";
import "./StatisticsContainer.css";
import { ReposWithPullRequests } from "../types/ReposWithPullRequests";
import RepoStatsContainer from "./RepoStatsContainer";

type StatisticsProps = {
  githubApiService?: GithubApiService;
  dependabotPulls?: PullRequest[];
  dependabotReposWithPullRequests?: ReposWithPullRequests[];
};

type StatisticsPropsState = {
  githubApiService: GithubApiService;
  dependabotReposWithPullRequests: ReposWithPullRequests[];
  dependabotPullRequests: PullRequest[];
  timeTilUpdate: number;
};

class StatisticsContainer extends Component<
  StatisticsProps,
  StatisticsPropsState
> {
  githubApiService: GithubApiService;
  dependabotPullRequests: PullRequest[];
  dependabotReposWithPullRequests: ReposWithPullRequests[];
  interval: any;

  constructor(props: StatisticsProps) {
    super(props);
    this.githubApiService = new GithubApiService();
    this.dependabotPullRequests = [];
    this.dependabotReposWithPullRequests = [];

    this.state = {
      dependabotReposWithPullRequests: this.dependabotReposWithPullRequests,
      dependabotPullRequests: this.dependabotPullRequests,
      githubApiService: this.githubApiService,
      timeTilUpdate: 0
    };
  }

  collapsePullRequests(
    dependabotReposWithPullRequests: ReposWithPullRequests[]
  ): PullRequest[] {
    return dependabotReposWithPullRequests.flatMap(x => x.pullRequests);
  }

  async componentDidMount() {
    const prsByRepo = await this.githubApiService.getPrsByRepo();
    this.setState({
      dependabotReposWithPullRequests: prsByRepo,
      dependabotPullRequests: this.collapsePullRequests(prsByRepo)
    });
    this.interval = setInterval(async () => {
      const prsByRepo = await this.githubApiService.getPrsByRepo();
      this.setState({
        dependabotReposWithPullRequests: prsByRepo,
        dependabotPullRequests: this.collapsePullRequests(prsByRepo)
      });
    }, 600000);
  }

  componentWillUnmount() {
    clearInterval(this.state.timeTilUpdate);
  }

  renderPull(state: StatisticsPropsState) {
    if (state.dependabotPullRequests[0]) {
      const securityPulls: PullRequest[] = state.dependabotPullRequests
        .filter(x => this.containsSecurityLabel(x))
        .sort(function(a, b) {
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        })
        .slice(0, 3);
      return (
        <div className="">
          {securityPulls.map(x => {
            return <PRContainer pullRequest={x} />;
          })}
        </div>
      );
    }
  }

  renderRepos(state: StatisticsPropsState) {
    if (state.dependabotPullRequests[0]) {
      return (
        <div className="title-text">
        <RepoStatsContainer 
          repos={this.state.dependabotReposWithPullRequests}
        />
        </div>
      );
    }
  }

  containsSecurityLabel(pull: PullRequest): boolean {
    for (const label of pull.labels) {
      if (label.name === "security") {
        return true;
      }
    }
    return false;
  }

  render() {
    return (
      <div className="parent">
        <div className="horizontal-30">
          <div className="alignment">
            <h1 className="vertical-centered pr-number-text">
              {this.state.dependabotPullRequests.length}
            </h1>
          </div>
        </div>
        <div className="horizontal-70">
        <h1 className="title-text">Security Pulls</h1>
          {this.renderPull(this.state)}
          <h1 className="title-text">Repo Stats</h1>
          {this.renderRepos(this.state)}
        </div>
      </div>
    );
  }
}

export default StatisticsContainer;
