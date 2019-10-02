import React, { Component } from "react";
import { ReposWithPullRequests } from "../types/ReposWithPullRequests";

interface RepoStatsProps {
  repos: ReposWithPullRequests[];
}

interface RepoStatsState {
  reposSortedByCount: ReposWithPullRequests[];
}

class RepoStatsContainer extends Component<RepoStatsProps, RepoStatsState> {
  numberDisplayed: number = 5;

  constructor(props: RepoStatsProps) {
    super(props);
    this.state = {
      reposSortedByCount: this.sortRepositorys(this.props.repos)
    };
  }

  sortRepositorys(repos: ReposWithPullRequests[]) {
    return repos.sort((x, y) => {
      return y.pullRequests.length - x.pullRequests.length;
    });
  }

  renderRepo(repo: ReposWithPullRequests): string {
    if (repo.pullRequests.length > 0) {
      return repo.repo.name + ": " + repo.pullRequests.length;
    } else {
      return "";
    }
  }

  renderRepos(repos: ReposWithPullRequests[]) {
    return (
      <h2>
        {repos
          .map((x, index) => {
            return (
              this.renderRepo(x) +
              (index === this.numberDisplayed - 1 ? "" : ", ")
            );
          })
          .slice(0, this.numberDisplayed)}
      </h2>
    );
  }

  render() {
    return (
      <div className="bottom-right">
        {this.renderRepos(this.state.reposSortedByCount)}
      </div>
    );
  }
}

export default RepoStatsContainer;
