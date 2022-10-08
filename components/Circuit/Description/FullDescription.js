import React, { Component } from 'react';
import {WebView} from 'react-native'
import HTMLView from 'react-native-htmlview';
export default class CircuitFullDescription extends Component{
    static navigationOptions = {
        title: "Description",
    }
    render() {
        const description = this.props.navigation.getParam('description')
        return(
            <HTMLView
                originWhitelist={['*']}
                automaticallyAdjustContentInsets={false}
                value={description}
            />
        );
    }
} 
