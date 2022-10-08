import React, { Component } from 'react';
import WebViewDescr from "../../WebView/WebViewDescr";
import { Container, ListItem, Button, Text, Card, Spinner, CardItem, Body, Left, List, View, Right, Header, Tabs, Tab, Badge, Icon, Content, Footer, FooterTab, Separator } from 'native-base';
import { ScrollView, Image, Dimensions, WebView } from 'react-native';
import MapView, {UrlTile, Marker, Callout, Circle} from 'react-native-maps';
import { CircuitDescriptionHeader } from "./CircuitDescriptionHeader";
import Modal from 'react-native-modal';
import { BASE_URL, MOBILE_URL, HEADER, DB_CIRCUIT_DOWNLOADED, DB_GAME } from '../../../constants/Request';
import Datastore from 'react-native-local-mongodb'
const db = new Datastore({ filename: 'Cirquizz' });
import { isLogged } from   '../../../services/index';
import { CreateGame, isCircuitDownloaded, CircuitStarted, getGameId } from '../../../services/circuits';
import Commentaire from './Commentaire';
import Dialog from "react-native-dialog";
import I18n from "../../../translations/i18n";
export default class CircuitDescription extends Component {
    static navigationOptions = ({navigation}) => {
      return {
        title: navigation.getParam('title'),
      }
    };

    state = {
        circuit: null,
        circuitDescriptionHeader: null,
        downloaded_circuit: null,
        showLoading: false,
        isModalVisisble: false,
        isDownloaded: null,
        isLogged: false, 
        game: null,
        showComment: false,
        downloadFinish: false
    };
    
    getCircuitDescription = () => {
        fetch(MOBILE_URL + '/courses/' + this.props.navigation.getParam('id') ,{
            method: 'GET',
            headers: HEADER
        })
        .then((response) => response.json())
        .then(async (res) => {
            const t = await isCircuitDownloaded(this.props.navigation.getParam('id'));
            t === null ? this.setState({isDownloaded: false}) : this.isCircuitInProgress()
            this.setState({ circuit: res });
        })
        .catch((err) => {
            console.log(err)
        });
    };

    isCircuitInProgress = async() => {
        const id = this.props.navigation.getParam('id');
        const game = await getGameId(id);
        game !== null ? this.setState({ isDownloaded: 'Exist', game: game}) : this.setState({ isDownloaded: true});
    };

    downloadCircuit = () => {
        this.setState({ showLoading: true, isModalVisisble: false });
        fetch(MOBILE_URL + '/courses/' + this.props.navigation.getParam('id') + '/download',{
            method: 'GET',
            headers: HEADER
        })
        .then((response) => response.json())
        .then(async (res) => {
            this.insertDownloadedCircuit(res);
            this.setState({ isDownloaded: true, showLoading: false, downloadFinish: true });
        })
        .catch((err) => {
            this.setState({ showLoading: false, isModalVisisble: false });
        });
    };

    downloadGame = async () => {
        const game = await CreateGame(this.props.navigation.getParam('id'));
        if(game){
            this.props.navigation.navigate("IntermediateStart", {circuit: this.state.circuit, version: this.state.circuit.id})
        }
    };

    insertDownloadedCircuit = (circuit) => {
        let db = new Datastore({ filename: DB_CIRCUIT_DOWNLOADED });

        db.loadDatabase(async () => {
            await db.insertAsync({...circuit});            
            this.setState({ downloaded_circuit: circuit });
        });
    }

    checkLogged = async() => {
      const log = await isLogged();
      this.setState({ isLogged: log });
    };

    componentDidMount(){  
        this.checkLogged();
        this.getCircuitDescription();
        this.setState({circuitDescriptionHeader: this.props.navigation.getParam("circuit")});
    };

    render() {
        return (
          this.state.circuit && (
            <Container>
              <Content>
                <View>
                  <Dialog.Container visible={this.state.isModalVisisble}>
                    <Dialog.Title>{I18n.t('downloadCircuit')}</Dialog.Title>
                    <Dialog.Description>
                        {I18n.t('willDownloadCircuit')} {this.state.circuit.course.name}.
                        {I18n.t('doYouWantContinue')}
                    </Dialog.Description>
                    <Dialog.Button bold label="Télécharger" onPress={() => this.downloadCircuit()} />
                    <Dialog.Button label="Annuler" onPress={() => this.setState({ isModalVisisble: false})} />
                  </Dialog.Container>

                  <Dialog.Container visible={this.state.showLoading}>
                    <Dialog.Title>{I18n.t('downloadPending')}</Dialog.Title>
                  </Dialog.Container>

                  <Dialog.Container visible={this.state.downloadFinish}>
                    <Dialog.Title>{I18n.t('downloadEnded')}</Dialog.Title>
                    <Dialog.Button bold label="Fermer" onPress={() => this.setState({downloadFinish: false})} />
                  </Dialog.Container>
                </View>

                <ScrollView>

                  <MapView
                    style={{
                      flex: 1,
                      width: Dimensions.get("window").width,
                      height: 150
                    }}
                    mapType="none"
                    initialRegion={{ 
                      latitude: this.props.navigation.getParam("latitude"),
                      longitude: this.props.navigation.getParam("longitude"),
                      latitudeDelta: 0.00922,
                      longitudeDelta: 0.00421
                    }}
                  >

                    <Marker
                      coordinate={{
                        latitude: this.props.navigation.getParam("latitude"),
                        longitude: this.props.navigation.getParam("longitude")
                      }}
                    />

                    <Circle
                      radius={this.state.circuit.distance/10}
                      fillColor={'rgba(0,0,255,0.3)'}
                      center={{ 
                        latitude: this.props.navigation.getParam('latitude'), 
                        longitude: this.props.navigation.getParam('longitude') 
                      }}
                      zIndex={2}
                    />

                    <UrlTile urlTemplate="https://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"/>
                  </MapView>

                  <CircuitDescriptionHeader
                      style={{ marginTop: 20 }}
                      circuit={this.state.circuit}
                    />
                  <Separator>
                    <Text style={{fontSize: 14}}>{I18n.t('infoCircuit')}</Text>
                  </Separator>
                  <List style={{ marginTop: 10 }}>
                    <ListItem
                      onPress={() =>
                        this.props.navigation.push("FullDescription", {
                          description: this.state.circuit.course
                            .translations[0].description
                        })
                      }
                    >
                      <Left>
                        <Text>{I18n.t('description')}</Text>
                      </Left>
                      <Right>
                        <Icon name="arrow-forward" />
                      </Right>
                    </ListItem>
                    <ListItem
                      onPress={() =>
                        this.props.navigation.push("CommentaireDescription", {
                          comments: this.state.circuit.comments
                        })
                      }
                    >
                      <Left>
                        <Text>{I18n.t('commentaire')}</Text>
                        <Badge warning style={{ marginLeft: 10 }}>
                          <Text>
                            {this.state.circuit.comments.length}
                          </Text>
                        </Badge>
                      </Left>
                      <Right>
                        <Icon name="arrow-forward" />
                      </Right>
                    </ListItem>
                    {this.state.isLogged &&
                      <ListItem style={{justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                        {this.state.isDownloaded === 'Exist' ? 
                          <Body style={{justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                            <Badge primary>
                              <Text>{I18n.t('circuitDejaComm')}</Text>
                            </Badge>
                          </Body>
                          : this.state.isDownloaded ?
                          <Badge info>
                            <Text>{I18n.t('circuitTelecharge')}</Text>
                          </Badge>
                          :
                          <Badge danger>
                            <Text>{I18n.t('dontHaveCircuit')}</Text>
                          </Badge> 
                        }
                      </ListItem>
                    }
                  </List>
                </ScrollView>
              </Content>
              
              <Footer>

                {!this.state.isLogged && 
                  <Body>
                    <Button full
                      onPress={() => this.props.navigation.navigate('Authentication')}>
                       <Text>Jouer</Text>
                    </Button>
                  </Body>
                }
                
                {this.state.isLogged &&
                  <Body>

                    { this.state.isDownloaded === 'Exist' ?
                        <Button full primary
                          onPress={() => this.props.navigation.navigate("IntermediateStart", {circuit: this.state.circuit, version: this.state.circuit.id})}>
                          <Text>{I18n.t('reprendreCircuit')}</Text>
                        </Button>
                      : this.state.isDownloaded ?
                        <Button full info
                          onPress={() => this.downloadGame()}>
                            <Text>{I18n.t('startCircuit')}</Text>
                        </Button>
                      :
                        <Button full warning 
                          onPress={() =>this.setState({ isModalVisisble: true })} >
                          <Text>{I18n.t('downloadCircuit')}</Text>
                        </Button>  
                    }
                  </Body>
                }
              </Footer>
            </Container>
          )
        );
    }

};
