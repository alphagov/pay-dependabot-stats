import React, { Component } from "react";
import { ReposWithPullRequests } from "../types/ReposWithPullRequests";
import { PullRequest } from "../types/PullRequest";
import moment from "moment";

interface RepoStatsProps {
  repos: ReposWithPullRequests[];
}

interface RepoStatsState {
  reposSortedByCount: ReposWithPullRequests[];
}

class RepoStatsContainer extends Component<RepoStatsProps, RepoStatsState> {
  numberDisplayed: number = 6;

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

  oldestPullRequest(pullRequests: PullRequest[]): PullRequest {
    const latest = pullRequests
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .pop()

    return latest!
  }

  renderRepos(repos: ReposWithPullRequests[]) {
    return (
      <div>
        {repos
          .filter(x => x.pullRequests.length > 0)
          .map((x, index) => {
            const oldest = this.oldestPullRequest(x.pullRequests)

            return (
              <div>
                <div className="repo-row">
                  <div className="repo-item">
                     <h2 className="govuk-heading-m govuk-!-margin-bottom-1">{ x.repo.full_name }</h2>
                  </div>
                  <div className="repo-item">
                     <h2 className="govuk-heading-m govuk-!-margin-bottom-1">{ x.pullRequests.length } remaining</h2>
                  </div>
                </div>
                <div>
                  <a className="govuk-link--no-visited-state" href={ oldest.html_url }>
                    Oldest pull request openened { moment(oldest.created_at).fromNow() }
                  </a>
                </div>

                <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
              </div>
            );
          })
          .slice(0, this.numberDisplayed)}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderRepos(this.state.reposSortedByCount)}
      </div>
    );
  }
}

export default RepoStatsContainer;
