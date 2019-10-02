import React, { Component } from "react";
import { GithubApiService } from "../lib/GitHubApiService";
import { PullRequest } from "../types/PullRequest";
import PRContainer from "./PRContainer";
import "./StatisticsContainer.css"

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
    const securityPulls : PullRequest[] = state.dependabotPulls
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
          <h1 className="vertical-centered pr-number-text">{this.state.dependabotPulls.length}</h1>          
        </div>
      </div>
      <div className="horizontal-centered">
        {this.renderPull(this.state)}
      </div>
      </div>
    );
  }
}

export default StatisticsContainer;
