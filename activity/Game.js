import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, AsyncStorage, BackHandler, ToastAndroid } from 'react-native';
import geolib from 'geolib';
import { Container, Footer, FooterTab, Button, Icon } from 'native-base';
import { Questions } from '../components/Question/Questions';
import Datastore from 'react-native-local-mongodb';
import { DB_GAME, DB_CIRCUIT_DOWNLOADED, HEADER, MOBILE_URL } from '../constants/Request';
import GameHeader from '../components/Game/GameHeader';
import GameStepDescription from '../components/Game/GameStepDescription';
import Transits from '../components/Transit/Transits';
import GameInstruction from '../components/Game/GameInstruction';
import GameLast from '../components/Game/GameLast';
import { CircuitStarted, CircuitDownloaded } from '../services/circuits'; 
const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };
import GPSState from 'react-native-gps-state'
let moment = require("moment");
let momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

import I18n from '../translations/i18n';
import Dialog from "react-native-dialog";



export default class Game extends Component {
    static navigationOptions = {
        tabBarVisible: false,
    }
    
    state = {
        me: null,
        time: 0,
        score: 0,
        etape: 0,
        translation: 0,
        question: null,
        game: null,
        circuit: null,
        location: null,
        menu: 'Instruction',
        isModalVisible: false
    };


    getCircuit = async () => {
        const db = await CircuitDownloaded();
        const id = this.props.navigation.getParam('version');
        const circuit = db.find((c) => c.id === id);
        this.setState({circuit});
        this.loadGame();
    }

    checkGame = async () => {
        const id = this.props.navigation.getParam('version');
        const db = await CircuitStarted();
        const game = db.find((g) => g.version_id === id);
        this.setState({ game });
        this.getCircuit();
    };

    loadGame = () => {
        const etape = this.state.circuit.steps.findIndex((s) => s.id === this.state.game.step_id);

        let question = null;
        let menu = 'Instruction';
        if(this.state.game.question_id != null){
            question = this.state.circuit.steps[etape].questions.findIndex((q) => q.id === this.state.game.question_id);
            menu = 'Questions'
        } 

        this.setState({question, etape, time: this.state.game.time, score: this.state.game.score, menu});
        if(this.state.game.time > 0){
            this.updateTimer();
        }
    }
    checkFirst = (circuit) => {
        if (geolib.isPointWithinRadius(
            {latitude: this.state.me.latitude, longitude: this.state.me.longitude},
            {latitude: circuit.latitude, longitude: circuit.longitude},
            circuit.tolerance
        )){
            this.updateTimer();
            this.nextEtape();
        }

    }

    nextEtape = () => {
        if(this.state.circuit.steps[this.state.etape].questions.length > 0 && this.state.screen !== 'questions'){
            this.setState({ screen: 'questions' })
        } else {
            this.setState({ etape: this.state.etape + 1, screen: 'instruction' });
        }
    }

    nextStep = () => {
        if(this.state.etape === 0 && this.state.menu === 'Navigation') {
            this.updateTimer();
        }
        
        if(this.state.menu === 'Navigation'){
            this.setState({ menu: 'Description'});
        }
        else if(this.state.etape + 1 === this.state.circuit.steps.length){
            this.setState({menu: 'Last'});
        }
        else if(this.state.menu === 'Description'){
            this.setState({ question: 0, menu: 'Questions' });
        } 
        else if(this.state.menu === 'Questions'){

            if(this.state.circuit.steps[this.state.etape].questions.length > this.state.question + 1){
                this.setState({question: this.state.question + 1 });
            } else {
                this.setState({ menu: 'Instruction', etape: this.state.etape + 1, question: null });
            }
        }
        else if( this.state.circuit.steps[this.state.etape + 1].transit_type === 'text')
        {
            this.setState({ etape: this.state.etape + 1, menu: 'Navigation' });
        }
        else {
            this.setState({ etape: this.state.etape + 1, menu: 'Instruction' });
        }
    }

    getScore = (pts) => {
        this.setState({ score: this.state.score + pts});
        this.nextStep();
    }

    updateTimer = () =>{
        let interval = setInterval(() => {
            if(this.state.etape + 1 === this.state.circuit.steps.length)
                clearInterval(interval);
            else
                this.setState({
                    time: this.state.time+1
                });
        },1000)
    };

    changeMenu = (menu) => {
        this.setState({ menu });
    }

    changeLanguage = (value) => {
        this.setState({ translation: value });
    }

    end = async () => {
        HEADER['Authorization'] = 'Bearer ' + await AsyncStorage.getItem('token');
        fetch(MOBILE_URL + '/games/' +  this.state.game.id + '/save', {
            method: 'POST',
            headers: HEADER
        })
        .then((data) => data.json())
        .then(async (res) => {
            const db = new Datastore({ filename: DB_GAME });
            await db.loadDatabaseAsync( async () => {
                await db.removeAsync({'id': this.state.game.id});
            });
            this.props.navigation.navigate('Circuit');
        })
        .catch((err) => {
            console.warn(err)
        });
    }

    pause = async () => {
        let game;  
        let db = new Datastore({ filename: DB_GAME });
        await db.loadDatabaseAsync( async () => {
            const game = await db.findOneAsync({'id': this.state.game.id});
            game.time = this.state.time;
            game.score = this.state.score;
            game.step_id = this.state.circuit.steps[this.state.etape].id;
            if(this.state.question !== null){
                game.question_id = this.state.circuit.steps[this.state.etape].questions[this.state.question].id;
            } else {
                game.question_id = null;
            }

            const g = JSON.stringify({
                step_id: game.step_id,
                question_id: game.question_id,
                score: game.score,
                time: game.time
            });

            HEADER['Authorization'] = 'Bearer ' + await AsyncStorage.getItem('token');
            fetch(MOBILE_URL + '/games/' +  this.state.game.id + '/save', {
                method: 'POST',
                headers: HEADER,
                body: g
            })
            .then((data) => data.json())
            .then(async (res) => {
                const tt =  await db.updateAsync({'id': this.state.game.id}, {...game}, {});
                this.props.navigation.navigate('Circuit');
            })
            .catch((err) => {
                console.warn(err)
            });
        });
    }

    abandon = async () => {
        HEADER['Authorization'] = 'Bearer ' + await AsyncStorage.getItem('token');
        fetch(MOBILE_URL + '/games/' +  this.state.game.id + '/discontinue', {
            method: 'POST',
            headers: HEADER
        })
        .then((data) => data.json())
        .then(async (res) => {
            const db = new Datastore({ filename: DB_GAME });
            await db.loadDatabaseAsync( async () => {
                await db.removeAsync({'id': this.state.game.id});
            });
            this.props.navigation.navigate('Circuit');
        })
        .catch((err) => {
            console.warn(err)
        });
    }

    getLocation = () => {
        this.watchId = navigator.geolocation.watchPosition((position) => {
            let region = {
                latitude:       position.coords.latitude,
                longitude:      position.coords.longitude,
                latitudeDelta:  0.00922*1.5,
                longitudeDelta: 0.00421*1.5
            };
            this.setState({location: region});
        },(error) =>         {
            console.warn(error);
        },{ enableHighAccuracy: true, timeout: 20000, maximumAge: 500, distanceFilter: 0 });
    }

    componentWillMount(){   
        this.checkGame();
        this.getCurrentLocation();
        this.getLocation();
    }

    getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            let region = {
                latitude:       position.coords.latitude,
                longitude:      position.coords.longitude,
                latitudeDelta:  0.00922*1.5,
                longitudeDelta: 0.00421*1.5
            }
            this.setState({location: region});
        }, (error) => {
        }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 500, distanceFilter: 0 });
    }
    componentWillUnmount() {
        this.backHandler.remove();
        navigator.geolocation.clearWatch(this.watchId);
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }


    handleBackPress = () => {
        this.setState({isModalVisible: !this.state.isModalVisible});
        return true
    };


    render(){
        return (
            this.state.circuit && this.state.game ?
            <Container>

                {/* Header */}
                {<GameHeader circuit={this.state.circuit.steps[this.state.etape]}
                            score={this.state.score}
                            time={this.state.time}
                            translation={this.state.translation}
                            languages={this.state.circuit.course.locales}
                            abandon={this.abandon}
                            pause={this.pause}
                            changeLanguage={this.changeLanguage}/>}

                {/* Menu Navigation */}
                {this.state.menu === 'Navigation' && 
                <Transits type={this.state.circuit.steps[this.state.etape].transit_type} 
                            circuit={this.state.circuit.steps[this.state.etape]} 
                            translation={this.state.translation}
                            location={this.state.location}
                            changeMenu={this.changeMenu}
                            next={this.nextStep}/> }

                {/* Menu Instruction */}
                {this.state.menu === 'Instruction' &&
                    <GameInstruction
                        etape={this.state.etape}
                        nbEtape={this.state.circuit.steps.length}
                        instruction={this.state.circuit.steps[this.state.etape].translations[this.state.translation].instruction}
                        changeMenu={this.changeMenu} />}

                {/* Menu Description */}
                {this.state.menu === 'Description' &&
                    <GameStepDescription
                        etape={this.state.etape}
                        nbEtape={this.state.circuit.steps.length}
                        description={this.state.circuit.steps[this.state.etape].translations[this.state.translation].description}
                        next={this.nextStep} />}

                {/* Menu Questions */}
                {this.state.menu === 'Questions' &&
                    <Questions 
                        etape={this.state.etape}
                        nbEtape={this.state.circuit.steps.length}        
                        nbQuestions={this.state.circuit.steps[this.state.etape].questions.length}
                        currentQuestion={this.state.question}
                        question={this.state.circuit.steps[this.state.etape].questions[this.state.question]}
                        translation={this.state.translation}
                        onSubmit={this.getScore}/>}

                {/* Menu Last */}
                {this.state.menu === 'Last' &&
                    <GameLast
                        navigation={this.props.navigation}
                        circuit={this.state.circuit}
                                score={this.state.score}
                                time={this.state.time}
                                game={this.state.game}/>}

                <Dialog.Container visible={this.state.isModalVisible}>
                    <Dialog.Title>Sauvegarder la partie</Dialog.Title>
                    <Dialog.Description>
                        {I18n.t('leaveGame')}
                    </Dialog.Description>
                    <Dialog.Button bold label="Sauvegarder" onPress={() => this.pause()} />
                    <Dialog.Button label="Continuer" onPress={() => this.setState({ isModalVisible: false})} />
                </Dialog.Container>
            </Container> : <View><Text>{I18n.t('missingInfoToPlay')}</Text></View>
        );

        // if(this.sta         t  && this.state.me && this.state.location){


        //     if(this.state.etape === this.state.circuit.steps.length){
        //         return (
        //             <Container>
        //                 <Body>
        //                     <Text>Vous avez terminé le circuit {this.state.circuit.course.name}</Text>
        //                     <Text>Score: {this.state.score}pts</Text>
        //                     <Text>Temps: {
        //                                 moment.duration(parseInt(this.state.time), 'seconds').format('H[h] m[m] s[s]')
        //                             }</Text>
        //                     <Button
        //                         onPress={() => this.props.navigation.navigate('Circuits')}>
        //                         <Text>Revenir au menu</Text>
        //                     </Button>
        //                 </Body>
        //             </Container>
        //         )
        //     }

        //     circuit = this.state.circuit.steps[this.state.etape];

        //     if (circuit.step_type === 'first')
        //         this.checkFirst(circuit);
        //     else if(circuit.transit_type === 'coordinates')
        //         this.checkPosition(circuit);


        //     return (
        //         <Container>
        //             <StatusBar backgroundColor="blue" barStyle="light-content" />
        //             <Header style={{'padding': 10}}>
        //                 <Body>
        //                 <Title>
        //                     <Text>{this.state.circuit.course.name}</Text>
        //                 </Title>
        //                 <Subtitle>
        //                     <Text>
        //                         Temps: {
        //                                 moment.duration(parseInt(this.state.time), 'seconds').format('H[h] m[m] s[s]')
        //                             }
        //                     </Text>
        //                 </Subtitle>
        //                 <Subtitle>
        //                     <Text>Score: {this.state.score} pts</Text>
        //                 </Subtitle>
        //                 </Body>

        //                 <Right>
        //                     <Button transparent onPress={() => this.props.navigation.navigate('Circuits')}>
        //                         <Text style={{ color: 'white' }}>Abandonner</Text>
        //                     </Button>
        //                 </Right>

        //             </Header>


        //             {this.state.screen === 'instruction' ?
        //                 <>
        //                     <Body style={{ justifyContent: 'center', flex: 1 }}>
        //                     <Text>Etape n° {this.state.etape+1}</Text>
        //                     <Text style={{fontSize: 30, textAlign: 'center'}}>{circuit.instruction}</Text>
        //                     </Body>

        //                     <Button full rounded
        //                         style={{borderRadius: 50, height: 100, width: 100, alignSelf: 'center', marginBottom: 20}}
        //                             onPress={() => this.setState({ screen: 'map'})}>
        //                         <Text style={{ color: 'white' }}>Go</Text>
        //                     </Button>
        //                 </>
        //                 : this.state.screen === 'transit' ?
        //                     <>
        //                         <Transit type={this.state.transit.type} etape={this.state.etape}/>

        //                         <MapView
        //                             ref={ref => { this.map = ref; }}
        //                             style={{ flex: 1 }}
        //                             initialRegion={this.state.location}
        //                             showsUserLocation
        //                             loadingEnabled
        //                             mapType="none">

        //                             <UrlTile urlTemplate="https://c.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        //                             <Marker
        //                                 title="Moi"
        //                                 coordinate={{
        //                                     latitude: this.state.me.latitude,
        //                                     longitude: this.state.me.longitude
        //                                 }}
        //                                 draggable
        //                                 pinColor="blue"
        //                                 onDragEnd={(e) => {
        //                                     this.setState({me: e.nativeEvent.coordinate})}
        //                                 }
        //                             />

        //                             <Marker
        //                                 title={circuit.instruction}
        //                                 coordinate={{
        //                                     latitude: circuit.latitude,
        //                                     longitude: circuit.longitude
        //                                 }}
        //                             />

        //                         </MapView>

        //                         <View style={{
        //                             flexDirection: "row", display: 'flex', alignItems: 'center', justifyContent:'center',flex: 1, position: "absolute",
        //                         bottom: 20, padding: 15 }}>
        //                             <Left>

        //                             </Left>
        //                             <Body>

        //                                     {circuit.transit_type === 'text' ?
        //                                     <Button rounded full iconRight large primary
        //                                         style={{ borderRadius: 35 }}
        //                                         onPress={() => this.nextEtape()}>
        //                                         <Icon type="FontAwesome" name="location-arrow" />
        //                                         <Text style={{ color: 'white' }}>J'y suis</Text>
        //                                     </Button> : <></>}

        //                             </Body>

        //                             <Right>
        //                                 <Button style={{alignSelf: "flex-end"}}
        //                                     rounded warning
        //                                     onPress={() => this.setState({ screen: 'instruction'})}>
        //                                     <Icon name="info-circle" />
        //                                 </Button>
        //                             </Right>


        //                         </View>

        //                     </>
        //                     :  this.state.screen === 'questions' ?
        //                         <Questions question={circuit.questions[0]} onSubmit={this.getScore}/>
        //                     : <></>
        //             }

        //         </Container>
        //     );
        // } else {
        //     return (
        //         <></>
        //     )
        // }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inline: {
        flex: 1,
        flexDirection: 'row'
    },
    map :{
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: "absolute"
    },
    but: {
        left: 0,
        right: 0,
        top: 0,
        position: "absolute"
    },
  
      button: {
          borderRadius: 4,
          padding: 10,
          marginLeft: 10,
          marginRight: 10,
          backgroundColor: '#ccc',
          borderColor: '#333',
          borderWidth: 1,
      },
  
    customView:{
        width: 20,
        height: 20
    }
});
