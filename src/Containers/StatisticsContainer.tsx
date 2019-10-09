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
    };
  }

  collapsePullRequests(
    dependabotReposWithPullRequests: ReposWithPullRequests[]
  ): PullRequest[] {
    return dependabotReposWithPullRequests.flatMap(x => x.pullRequests);
  }

  async componentDidMount() {
    const scopes : Headers = await this.githubApiService.checkScopes();
    if(!this.githubApiService.headersHaveRepoScope(scopes)) {
      await this.scopesRestricted();
    } else {
      this.printScopeError();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async scopesRestricted() : Promise<void> {
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

  printScopeError() : void {
    console.log("You are running this application using a token with elevated scope that allows " +
    "access to private repos, please use another token")
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
        <div>
        <RepoStatsContainer
          repos={this.state.dependabotReposWithPullRequests}
        />
        </div>
      );
    }
  }

  containsSecurityLabel(pull: PullRequest): boolean {
    return pull.labels
      .map(label => label.name)
      .includes("security")
  }

  render() {
    return (
      <div className="parent">
        <div className="horizontal-centered pr-container">
          <div className="alignment">
            <h1 className="vertical-centered pr-number-text">
              {this.state.dependabotPullRequests.length}
            </h1>
          </div>
        </div>
        <div className="horizontal-centered details-container">
          <div className="govuk-body govuk-!-margin-bottom-7">
            <h1 className="govuk-heading-l">Vulnerabilities</h1>
            {this.renderPull(this.state)}
          </div>

          <div className="govuk-body">
            <h1 className="govuk-heading-l">Repositories</h1>
            {this.renderRepos(this.state)}
          </div>
        </div>
      </div>
    );
  }
}

export default StatisticsContainer;
