import React from 'react';

export default class SourceButton extends React.Component {
    render() {
        return (
            <button 
                className={"sourceButton" + (this.props.toggled ? " activeFilter" : "")}
                id={this.props.id}>
                {this.props.name}
            </button>
        );
    }
}