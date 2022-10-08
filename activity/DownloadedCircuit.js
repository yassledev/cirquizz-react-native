import React, { Component } from 'react';
import { Container, Text,  Body,Left, Right, Icon, Item, Content, ListItem, Separator } from 'native-base';
import { StyleSheet, Image, ScrollView, Switch, AsyncStorage} from 'react-native';
import { CircuitStarted, CircuitFinished, CircuitDownloaded } from '../services/circuits';
import { CircuitListItemYass} from '../components/Circuit/CircuitListYass';
import { ImageBackground } from 'react-native'
let moment = require("moment");
let momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);
import I18n from '../translations/i18n';



export default class Circuit extends Component {
    static navigationOptions = {
      title: 'Mes cirquizz'
    }
    state = {
        circuits: [],
        progress: [],
    };

    playGame = (circuit) => {
        //console.warn(circuit);
        this.props.navigation.navigate('Description', {id : circuit.id, navigation: this.props.navigation, latitude: 0, longitude: 0, title: circuit.course.name})
        //this.props.navigation.push("Description", {circuit, version: circuit.id});
    };
    
    inProgress = async () => {
        const circuits = await CircuitDownloaded();
        const games = await CircuitStarted();
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        
        const all_games = circuits.filter((c) => {
          return games.some((g) => {
              return (c.id === g.version_id) && (g.user_id === user.id);
          })
        });
 
        const all_downloaded = circuits.filter((c) => {
          return !games.some((g) => {
            return (c.id === g.version_id) && (g.user_id === user.id);
          })
        })

        this.setState({progress: all_games, circuits: all_downloaded}, () => console.warn(this.state.progress));
    }


    async componentWillMount(){
        // this.loadCircuits();
        didBlurSubscription = this.props.navigation.addListener('willFocus', payload => {   
            this.inProgress();
        });

    }

    componentWillUnmount(){
        didBlurSubscription.remove();
    }
    render() {
        return (
          <ImageBackground source={require('../assets/bg.png')} style={{ height: '100%', width: '100%', backgroundColor: "#01E2B3" }}>
              
              <ScrollView>
                <Separator bordered style={{backgroundColor: 'forestgreen'}}>
                  <Text style={{fontSize: 16, color: 'white'}}>{I18n.t('partieComm')}</Text>
                </Separator>
                {this.state.progress.map((content, index) => (
                  <CircuitListItemYass
                    key={index}
                    circuit={content}
                    started={true}
                    onPress={() =>
                      this.playGame(content)
                    }
                  />
                ))}
                <Separator bordered style={{backgroundColor: 'red'}}>
                  <Text style={{fontSize: 16, color: 'white'}}>{I18n.t('partieNonDem')}</Text>
                </Separator>

                {this.state.circuits.map((content, index) => (
                      <CircuitListItemYass
                        key={index}
                        circuit={content}
                        started={false}
                        onPress={() =>
                          this.props.navigation.navigate("Description", {
                            id: content.id,
                            latitude: 0,
                            longitude: 0,
                            title: content.course.name
                          })
                        }
                      />
                    ))} 
              </ScrollView>
          </ImageBackground>
        );
    }
}


const styles = StyleSheet.create({
    background: {
        backgroundColor: '#102A6B',
    },
});
