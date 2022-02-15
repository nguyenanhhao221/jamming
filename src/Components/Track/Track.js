import React from "react";
import './Track.css'

export class Track extends React.Component {
    render() {
        return (
            <div className="Track">
                <div className="Track-information">
                    {/* <!-- track name will go here --> */}
                    <h3></h3>
                    {/* <!-- track artist will go here--> | <!-- track album will go here --> */}
                    <p></p>
                </div>
                {/* <!-- + or - will go here --> */}
                <button className="Track-action"></button>
            </div>
        );
    };
    // Method displays a <button> element with - as its content if the isRemoval property is true, and a + <button> element if the isRemoval property is false. Set the class name to Track-action.
    renderAction() {
        return (
            (this.props.isRemoval ?
                <button className="Track-action">-</button> :
                <button className="Track-action">+</button>)
        );
    }
};