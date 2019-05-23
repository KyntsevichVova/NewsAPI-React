import React from 'react';

export default class InputButton extends React.Component {
    render() {
        return (
            <button 
                className="inputButton"
                onClick={this.props.handleInputClick}>
                Search
            </button>
        );
    }
}