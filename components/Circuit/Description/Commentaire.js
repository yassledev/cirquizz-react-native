import React, { Component } from 'react';
import { Text,  Card, CardItem } from 'native-base';
import StarRating from 'react-native-star-rating';
import {ScrollView } from 'react-native';

export default class CircuitCommentaire extends Component{
      static navigationOptions = {
        title: "Commentaires",
    }
    render() {
        const commentaires = this.props.navigation.getParam('comments');
        return (
          <ScrollView>
            {commentaires.length === 0 &&
              <Text style={{fontSize: 16, justifyContent: 'center', alignContent: 'center', alignSelf:'center', alignItems: 'center'}}>
                Ce circuit n'a aucun commentaire.
              </Text>}
            {commentaires.map((comment, key) => 
              <Card key={key}>
                <CardItem header>
                    <Text style={{fontWeight: 'bold', fontSize: 14, marginRight: 5}}>{comment.user.username}</Text>
                    <Text style={{fontSize: 10, color: 'grey', marginRight: 5}}>{comment.created_at}</Text>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    starSize={15}
                    fullStarColor='orange'
                    emptyStarColor='grey'
                    rating={comment.stars} />
                </CardItem>
                <CardItem>
                  <Text>{comment.comment}</Text>
                </CardItem>
              </Card>
            )}
          </ScrollView>
      )
    }
} 
