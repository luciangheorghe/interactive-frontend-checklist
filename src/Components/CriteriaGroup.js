import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Criterion from './Criterion';
import './CriteriaGroup.css';

class CriteriaGroup extends Component {
  constructor(props) {
    super(props);

    // tally the number of each priority level used in this group
    const levelCounts = {
      low: this.props.criteria.filter(child => child.level === 'low').length,
      med: this.props.criteria.filter(child => child.level === 'med').length,
      high: this.props.criteria.filter(child => child.level === 'high').length,
    };

    // store the tallies in the local state
    this.state = {
      low: levelCounts.low,
      med: levelCounts.med,
      high: levelCounts.high
    };

    this.updateChecksRemaining = this.updateChecksRemaining.bind(this);
  }

  // receives checkbox updates from individual criteria, and sends updated counts upstream to App.js
  updateChecksRemaining(criteria, level, isChecked) {
    // retrieve the counts and update the appropriate one
    const levels = this.state;
    levels[level] = this.state[level] + (isChecked === true ? 1 : -1);

    // send the new values upstream
    this.props.updateMasterTallies(this.props.title, this.state.low, this.state.med, this.state.high);

    // update the local state keeping track of levels for this group
    this.setState({
      levels
    });
  }

  render() {
    const total = this.state.low + this.state.med + this.state.high;

    const criteria = this.props.criteria.map((criterion, index) => {
      return (
        <Criterion priority={criterion.level} label={criterion.label} text={criterion.description} key={index} updateChecksRemaining={this.updateChecksRemaining} />
      );
    });

    return (
      <div className="criteria-group">
        <h2 className="criteria-group-title">{this.props.title}</h2>
        <ul className="priority-counts">
          <li className="priority-count high">High: {this.state.high}</li>
          <li className="priority-count medium">Medium: {this.state.med}</li>
          <li className="priority-count low">Low: {this.state.low}</li>
          <li className="priority-count total">Total: {total}</li>
          {
            total === 0
              ? <li className="priority-count checkmark">&#10003;</li>
              : null
          }
        </ul>
        {criteria}
      </div>
    );
  }
}

CriteriaGroup.propTypes = {
  title: PropTypes.string.isRequired,
  criteria: PropTypes.array.isRequired,
};

export default CriteriaGroup;
