import React, {Component} from 'react';
import { WebView, Dimensions, Image, ScrollView } from 'react-native';
import { Button, Text, View } from 'native-base';
import HTML from 'react-native-render-html';
const WIDTH = Dimensions.get('window').width - 150;

export default class TransitText extends Component {

    render()
    {
        return (
            <>

                <ScrollView style={{flex: 1, width: '90%', marginLeft: '5%'}}>
                    <HTML html={this.props.circuit.translations[this.props.translation].instruction} />
                </ScrollView>

                <View style={{ alignItems: 'center', justifyContent: 'center',paddingTop:60}}>
                        <Image source={require("../../assets/mask-bottom.png")} style={[ {position: 'absolute', top:0, left:0, right:0, width:'100%', resizeMode:'stretch', alignSelf: 'flex-end'}]}/>
                        <View style={{width: '90%', marginLeft: '5%'}}>
                            <Text style={{fontSize: 24, color:'#346086', fontWeight: 'bold', marginBottom: 20, alignSelf: 'center'}}>Suivez les instructions pour vous rendre à l'étape</Text>
                        </View>
                            <Button full light 
                                style={{width: WIDTH, alignItems: 'center', justifyContent: 'center', borderRadius: 25,margin:30,marginTop:0,alignSelf:'center'}}
                                onPress={() => this.props.next()}>
                                <Text style={{fontWeight: 'bold'}}>J'ai trouvé l'endroit !</Text>
                            </Button>  
                </View>   
            </>
        )
    }
}