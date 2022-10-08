import React, {Component} from 'react';
// import TransitCompass_Test from './TransitCompass_Test';
import TransitCompass from './TransitCompass';
import TransitCoordinates from './TransitCoordinates';
import TransitText from './TransitText'
import TransitTempature from './TransitTemperature';

export default class Transits extends Component {

    render() {
        return (
            this.props.type === 'temperature' ?
            <TransitTempature circuit={this.props.circuit} translation={this.props.translation} next={this.props.next}
                    changeMenu={this.props.changeMenu} location={this.props.location}/> :
            this.props.type === 'compass' ?
                 <TransitCompass circuit={this.props.circuit} translation={this.props.translation} next={this.props.next} 
                 changeMenu={this.props.changeMenu} location={this.props.location}/> :
            this.props.type === 'coordinates' ? 
                <TransitCoordinates circuit={this.props.circuit} translation={this.props.translation} next={this.props.next} 
                changeMenu={this.props.changeMenu} location={this.props.location}/> :
            this.props.type === 'text' ? 
                <TransitText circuit={this.props.circuit} translation={this.props.translation} next={this.props.next}/> :
            <></>
        )
    }
}