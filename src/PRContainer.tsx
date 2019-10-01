import { Component } from "react";
import React from "react";
import { PullRequest } from "./types/PullRequest";

type PRContainerProps = {
    pullRequest: PullRequest
}

class PRContainer extends Component<PRContainerProps> {

    constructor(props: PRContainerProps) {
        super(props)
    }

    render() {
        return (
            <div>
                <h2>{this.props.pullRequest.title}</h2>
            </div>
        )
    }

}

export default PRContainer;