import { Component } from "react";
import React from "react";
import { PullRequest } from "../types/PullRequest";
import { Status } from "../types/Status";
import DateContainer from "./DateContainer";
import "./PRContainer.css"

type PRContainerProps = {
  pullRequest: PullRequest;
};

type PRContainerState = {
  status: string;
};

class PRContainer extends Component<PRContainerProps, PRContainerState> {
  constructor(props: PRContainerProps) {
    super(props);
    this.state = {
      status: ""
    };
  }

  async componentDidMount() {
    const status = await fetch(this.props.pullRequest.statuses_url);
    const statusJson: Status[] = await status.json();
    this.setState({
      status: statusJson[0].state
    });
  }

  renderBuildState(status: string) {
    switch (status) {
      case "error":
        return "Failed";
      case "pending":
        return "Pending";
      case "success":
        return "Success";
    }
  }

  renderState(state: PRContainerState) {
    return <p>Build Status: {this.renderBuildState(state.status)}</p>;
  }

  renderDate(dateString: string) {
    const date: Date = new Date(dateString);
    return (
      <p>
        Open since - {date.getDay}, {date.getDate}
      </p>
    );
  }

  render() {
    return (
      <div>
        <h2 className="pr-widget">
          {this.props.pullRequest.title} <DateContainer dateString={this.props.pullRequest.created_at} /> {this.renderState(this.state)}
        </h2>
      </div>
    );
  }
}

export default PRContainer;
