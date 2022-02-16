import React from "react";
import './Track.css'

export class Track extends React.Component {
    constructor(props) {
        super(props);
        this.addTrack = this.addTrack.bind(this); 
    }
    //Use renderAction method to determine the "+" or "-" button
    //Will also render the event handler here whenever user click on button
    renderAction() {
        if (this.props.isRemoval) {
            return <button className="Track-action">-</button>
        } else {
            return <button 
                        className="Track-action"
                        // add event listener onClick
                        // When user click, run the addTrack method of Track component
                        onClick={this.addTrack}>+</button>
        }
    }
    //addTrack is event handler for whenever the user click on the button
    //this.props.onAdd is refer to the addTrack method from App.js
    addTrack() {
        this.props.onAdd(this.props.track);
    }
    
    render() {
        return (
            <div className="Track">
                <div className="Track-information">
                    {/* <!-- track name will go here --> */}
                    {/* Access track name */}
                    <h3>{this.props.track.name}</h3>
                    {/* <!-- track artist will go here-->  <!-- track album will go here --> */}
                    <p>{this.props.track.artist} | {this.props.track.album}</p>
                </div>
                {/* <!-- + or - will go here --> */}
                {this.renderAction()}
            </div>
        );
    };
    // Method displays a <button> element with - as its content if the isRemoval property is true, and a + <button> element if the isRemoval property is false. Set the class name to Track-action.

};