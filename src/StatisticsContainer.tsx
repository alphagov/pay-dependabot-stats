import React, { Component } from "react";
import { GithubApiService } from "./lib/GitHubApiService";
import { PullRequest } from "./types/PullRequest";
import PRContainer from "./PRContainer";

type StatisticsProps = {
  githubApiService?: GithubApiService;
  dependabotPulls?: PullRequest[];
};

type StatisticsPropsState = {
  githubApiService: GithubApiService;
  dependabotPulls: PullRequest[];
};

class StatisticsContainer extends Component<
  StatisticsProps,
  StatisticsPropsState
> {
  githubApiService: GithubApiService;
  dependabotPulls: PullRequest[];

  constructor(props: StatisticsProps) {
    super(props);
    this.githubApiService = new GithubApiService();
    this.dependabotPulls = [];
    this.state = {
      dependabotPulls: this.dependabotPulls,
      githubApiService: this.githubApiService
    };
  }

  async componentDidMount() {
    this.setState({
      dependabotPulls: await this.githubApiService.getPullRequests()
    });
  }

  renderPull(state: StatisticsPropsState) {
    if (state.dependabotPulls[0]) {
      return <PRContainer pullRequest={state.dependabotPulls[0]} />;
    }
  }

  render() {
    return (
      <div>
        <h1>{this.state.dependabotPulls.length}</h1>
        {this.renderPull(this.state)}
      </div>
    );
  }
}

export default StatisticsContainer;
