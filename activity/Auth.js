import React, { Component } from 'react';
import { Container, Button, Text} from 'native-base';
import { Image, View, ImageBackground } from 'react-native';
import Login from './Login';
import Register from './Register';

import Dimensions from 'Dimensions';
const DEVICE_HEIGHT = Dimensions.get('window').height;
import I18n from '../translations/i18n';

export default class Auth extends Component {

    static navigationOptions = {
        header: null,
        headerMode: 'none'
    }

    render() {

        return (
            <Container> 
                <ImageBackground source={require('../assets/bg.png')} style={{width: '100%', height: '100%'}}>
                <View style={{ height: DEVICE_HEIGHT/3, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={require("../assets/dark_copy.png")} style={{zIndex: 9999}}/>
                    <View style={{width: '80%', alignContent: 'center', alignItems: 'center', alignSelf: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 16, fontWeight: 'bold', justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
                            <Text>Authentification</Text>
                        </Text>
                    </View>
                 </View>
                 <View style={{flex: 1}}>

                 </View>
                <View style={{flex: 1, width: '80%', alignContent: 'center', alignItems: 'center', alignSelf: 'center', justifyContent: 'center'}}>
                    <Button full style={{borderRadius: 30}}
                        onPress={() => this.props.navigation.push('Login')}>
                        <Text>
                            {I18n.t('connect')}
                        </Text>
                    </Button>

                    <Button full transparent
                        onPress={() => this.props.navigation.push('Register')}>
                        <Text>
                            {I18n.t('register')}
                        </Text>
                    </Button>
                </View>
                </ImageBackground>


                {/* <Login navigation={this.props.navigation}/> */}
                {/* <View style={{flex: 1, justifyCenter: 'center', alignItems: 'center'}}>
                    <Image source={require('../assets/cirquizz.png')} />
                </View>
                <View style={{flex: 3}}>
                    <Tabs>
                        <Tab heading="Login">
                            
                        </Tab>
                        <Tab heading="Register">
                            <Register />
                        </Tab>
                    </Tabs>
                </View> */}
            </Container>
        );
    }
}
