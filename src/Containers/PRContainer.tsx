import { Component } from "react";
import React from "react";
import { PullRequest } from "../types/PullRequest";
import { Status } from "../types/Status";
import DateContainer from "./DateContainer";
import "./PRContainer.css";

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
      status: statusJson
      .filter(function (s) { return s.context.includes("jenkins") || s.context.includes("travis") })
      .sort(function (a, b) { return new Date(b.created_at).getTime() - new Date(a.created_at).getTime() })[0].state
    });
  }

  renderBuildState(status: string) {
    switch (status) {
      case "failure":
      case "error":
        return "Failed";
      case "pending":
        return "Pending";
      case "success":
        return "Success";
    }
  }

  renderState(state: PRContainerState) {
    if(this.props.pullRequest) {
      
    }
    return <p>Build Status: {this.renderBuildState(state.status)}</p>;
  }

  renderRepo(html_url: string) {
    return (
      <p>
        Repository:{" "}
        {html_url.substring(
          html_url.indexOf("alphagov"),
          html_url.indexOf("/pull")
        )}
      </p>
    );
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
          {this.props.pullRequest.title}{" "}
          <DateContainer dateString={this.props.pullRequest.created_at} />{" "}
          {this.renderState(this.state)}{" "}
          {this.renderRepo(this.props.pullRequest.html_url)}
        </h2>
      </div>
    );
  }
}

export default PRContainer;
