import React, {Component} from 'react';
import { Form, Item, Container, Label, Text, Input, Button } from 'native-base';
import I18n from '../../translations/i18n';
import Datastore from 'react-native-local-mongodb';
//import { Updates } from 'expo';
import StarRating from 'react-native-star-rating';
import { MOBILE_URL, HEADER, DB_GAME } from '../../constants/Request';
import {AsyncStorage} from "react-native";

let moment = require("moment");

const styles = {
    alignItems:'center',
    justifyContent:'center',
    textAlign: 'center',
    alignSelf:'center',
    marginTop: 10
};

export default class GameLast extends Component {
    
    state = {
        commentaire: null,
        note: 3,
        error: null,
        res: null
    };

    componentWillMount(){
        this.terminer();
    };

    note = async () => {
        const credentials = JSON.stringify({
            comment: this.state.commentaire,
            rate: this.state.note
        });

        HEADER['Authorization'] = 'Bearer ' +   await AsyncStorage.getItem('token');

        fetch(MOBILE_URL + '/games/' + this.props.circuit.id + '/comment', {
            method: 'POST',
            headers: HEADER,
            body: credentials
        })
        .then((res) => {
            this.setState({res});
            this.goCircuit();
        })
        .catch((err) => {
            this.setState({ error: err})
        })
    };

    terminer = async() => {
        //TODO Mettre à jour la table Stat sur la prod, besoin de récupérer la game.
        const body = JSON.stringify({
            score: this.props.score,
            time: this.props.time
        });

        HEADER['Authorization'] = 'Bearer ' +   await AsyncStorage.getItem('token');
        fetch(MOBILE_URL + '/games/' + this.props.game.id + '/end', {
            method: 'POST',
            headers: HEADER,
            body
        })
        .then(async (res) => {
            const db = new Datastore({ filename: DB_GAME });
            await db.loadDatabaseAsync( async () => {
                await db.removeAsync({'id': this.props.game.id});
            });
            this.setState({res});
        })
        .catch((err) => {
            this.setState({ error: err})
        })
    };

    onStarRatingPress(rating) {
        this.setState({
            note: rating
        });
    };

    goCircuit() {
        this.props.navigation.navigate('AppLoading');
    };

    render() {
        return (
            <Container>
                <Text>Félicitation vous avez terminé le circuit ! </Text>
                <Text>{I18n.t('score')}{this.props.score}</Text>
                <Text>{I18n.t('temps')}{moment.duration(parseInt(this.props.time), 'seconds').format('H[h] m[m] s[s]')}</Text>

                <Form>
                    <Item floatingLabel style={{marginBottom: 20}}>
                        <Label>Commentaire</Label>
                        <Input
                            onChangeText={(text) => this.setState({ commentaire: text })}
                        />
                    </Item>

                    <StarRating
                        style={{marginTop: 20}}
                        disabled={false}
                        maxStars={5}
                        rating={this.state.note}
                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                    />

                    <Button
                        onPress={() => this.note()}
                        style={styles}>
                        <Text>Valider</Text>
                    </Button>

                    <Button
                        onPress={() => this.goCircuit()}
                        style={styles}>
                        <Text>Passer</Text>
                    </Button>

                </Form>
                {this.state.error && <Text>Erreur : {this.state.error}</Text>}
            </Container>
        )
    }
}