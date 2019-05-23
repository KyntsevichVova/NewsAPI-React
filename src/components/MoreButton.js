import React from 'react';

export default class MoreButton extends React.Component {
    render() {
        if (this.props.visible) {
            return (
                <div className="moreButtonWrapper">
                    <button 
                        className="moreButton"
                        onClick={this.props.moreButtonClick}>
                        Show more
                    </button>   
                </div>
            );
        } else {
            return null;
        }
    }
}