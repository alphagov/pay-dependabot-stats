import React, { Component } from "react";
import { GithubApiService } from "./lib/GitHubApiService";
import { PullRequest } from "./types/PullRequest";
import { RateLimitError } from "./types/RateLimitError";

type StatisticsProps = {
  githubApiService?: GithubApiService;
  dependabotPulls?: PullRequest[] | RateLimitError;
};

type StatisticsPropsState = {
  githubApiService: GithubApiService;
  dependabotPulls: PullRequest[] | RateLimitError;
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

  render() {
    return (
      <div>
        <h1>
          {() => {
            if (this.state.dependabotPulls as PullRequest[]) {
              return (this.state.dependabotPulls as PullRequest[]).length;
            } else {
              return (this.state.dependabotPulls as RateLimitError).message;
            }
          }}
        </h1>
      </div>
    );
  }
}

export default StatisticsContainer;
