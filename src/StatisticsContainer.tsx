import React, { Component } from 'react'
import { GithubApiService } from './lib/GitHubApiService';
import { PullRequest } from './types/PullRequest';
import { RateLimitError } from './types/RateLimitError';

type StatisticsProps = {
    githubApiService? : GithubApiService;
    dependabotPulls? : PullRequest[] | RateLimitError;
}

class StatisticsContainer extends Component<StatisticsProps> {
    
    githubApiService: GithubApiService;
    dependabotPulls: never[];

    constructor(props: StatisticsProps) {
        super(props);
        this.githubApiService = new GithubApiService();
        this.dependabotPulls = [];
    }

    async componentDidMount() {
        this.setState({
            dependabotPulls: await this.githubApiService.getPullRequests()
        })
    }

    render() {
        return (
            <div>
                <h1>{this.props.dependabotPulls}</h1>
            </div>
        )
    }
}

export default StatisticsContainer;