import React, { Component } from "react";
import moment, { Moment } from "moment";

interface DateContainerProps {
  dateString: string;
}

interface DateContainerState {
  date: Moment;
}

class DateContainer extends Component<DateContainerProps, DateContainerState> {
  render() {
    return (
      <p>
        Opened <strong>{ moment(this.props.dateString).fromNow() }</strong>
      </p>
    );
  }
}

export default DateContainer;
