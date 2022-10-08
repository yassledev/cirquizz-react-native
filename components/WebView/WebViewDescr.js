import React, {Component} from 'react';

import {StyleSheet, WebView} from "react-native";
import {Container} from 'native-base';

export default class WebViewDescr extends Component{

    render() {
        return (
            <Container>
                {
                    this.props.circuit && <WebView
                        originWhitelist={['*']}
                        source={{ html: this.props.circuit.status }}
                        style={styles.video}
                    />
                }

            </Container>
        );
    }
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    video: {
        marginTop: 20,
        maxHeight: 600,
        width: 320
    }
});