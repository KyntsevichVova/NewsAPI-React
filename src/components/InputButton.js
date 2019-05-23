import React from 'react';

export default class InputButton extends React.Component {
    render() {
        return (
            <button 
                className={this.props.buttonStyle}
                onClick={this.props.handleInputClick}>
                {this.props.children}
            </button>
        );
    }
}