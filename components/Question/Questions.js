import React from 'react';
import {View,Text} from 'native-base'
import QcmUnique from './QcmUnique';
import QcmMultiple from './QcmMultiple';
import QcmSaisie from './QcmSaisie'

export const Questions = (props) => {

    const type = props.question.type;
    return (
        <>
            <View style={{height: 100, alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                <Text style={{fontSize: 20, color:'#346086', fontWeight: 'bold', marginBottom: 10, marginTop: 10}}>Questions de l'étape {props.etape+1} / {props.nbEtape} </Text>
                <Text style={{fontSize: 20, color:'#346086', fontWeight: 'bold', marginBottom: 10, marginTop: 10}}>Question {props.currentQuestion+1} / {props.nbQuestions} </Text>

            </View>
            <View style={{ borderBottomColor: '#346086', borderBottomWidth: 1, marginLeft: 50, marginRight: 50, marginBottom: 10}}/>
                
            {type === 'qcm_unique' ? 
                <QcmUnique question={props.question} translation={props.translation} onSubmit={props.onSubmit} currentQuestion={props.currentQuestion+1} nbrQuestions={props.nbQuestions}/> :
            type === 'qcm_multiple' ? 
                <QcmMultiple question={props.question} translation={props.translation} onSubmit={props.onSubmit} currentQuestion={props.currentQuestion+1} nbrQuestions={props.nbQuestions}/> :
            type === 'image' ? 
                <> </> :
            type === 'sound' ? 
                <> </> :
            type === 'free'  ? 
                <QcmSaisie question={props.question} translation={props.translation} onSubmit={props.onSubmit} /> :
            <> </>
            }
        </>
    )
}