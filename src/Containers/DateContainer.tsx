import React, { Component } from "react";
import moment, { Moment } from "moment";

interface DateContainerProps {
  dateString: string;
}

interface DateContainerState {
  date: Moment;
}

class DateContainer extends Component<DateContainerProps, DateContainerState> {
  constructor(props: DateContainerProps) {
    super(props);
    this.state = {
      date: moment()
    };
  }

  componentDidMount() {
    this.setState({
      date: moment(this.props.dateString)
    });
    moment(this.props.dateString, "YYYY-MM-DD ");
    console.log(this.props.dateString);
    console.log(moment(this.props.dateString));
  }

  parseDayOfWeek(index: number): string {
    switch (index) {
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
      case 7:
        return "Sunday";
      default:
        return "ParseError";
    }
  }

  render() {
    return (
      <p>
        Open Since: {this.parseDayOfWeek(this.state.date.day())},{" "}
        {this.state.date.date()}/{this.state.date.month() + 1}/
        {this.state.date.year()}
      </p>
    );
  }
}

export default DateContainer;
