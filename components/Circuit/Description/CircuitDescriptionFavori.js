import React, { Component } from "react";
import {Text, View, Card, CardItem, Body, Thumbnail, Icon, Right, Button} from "native-base";
import { Image, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

let moment = require("moment");
let momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);
exports.CircuitDescriptionFavori = props => (
    <View style={{marginTop: 20}}>
            <CardItem bordered button onPress={() => props.onPress()}>
                <Body>

                    <View>
                        <Text style={styles.title}>{props.circuit.version.course.name}</Text>
                    </View>
                    <View
                        style={[styles.specsWrapper]}
                    >
                        <View style={styles.specsBloc}>
                            <MaterialIcons name="linear-scale" style={styles.specsIcons} />
                            <Text style={styles.specsText}>
                                {" "}
                                {props.circuit.version.distance !== null
                                    ? (props.circuit.version.distance / 1000).toFixed(1)
                                    : "0"}{" "}
                                km
                            </Text>
                        </View>
                        <View style={styles.specsBloc}>
                            <MaterialIcons name="alarm" style={styles.specsIcons} />
                            <Text style={styles.specsText}>
                                {" "}
                                {props.circuit.duration !== null
                                    ? moment
                                        .duration(parseInt(props.circuit.version.duration), "seconds")
                                        .format("H[h] m[ min]")
                                    : "0"}
                            </Text>
                        </View>
                        <View style={styles.specsBloc}>
                            <MaterialIcons name="timeline" style={styles.specsIcons} />
                            <Text style={styles.specsText}>
                                {" "}
                                {props.circuit.ascent !== null
                                    ? "± " +
                                    Math.abs(
                                        Math.round(props.circuit.version.ascent) -
                                        Math.round(props.circuit.version.descent)
                                    )
                                    : "0"}{" "}
                                m
                            </Text>
                        </View>
                        {props.circuit.stars ? (
                            <View style={styles.specsBloc}>
                                <MaterialIcons name="star" size={30} color="black" />
                                <Text>{props.circuit.stars}</Text>
                            </View>
                        ) : (
                            <></>
                        )}
                    </View>


                </Body>
            </CardItem>
    </View>

);

const styles = StyleSheet.create({
  image: {
    width: 30,
    height: 30
  },
  specs: {
    alignItems: "center",
    marginLeft: 10,
    flexDirection: "row"
  },
  specsText: {
    fontSize: 13,
      backgroundColor: "rgba(0,0,0,0)"
  },
  title: {
    fontWeight: "500",
    paddingLeft: 5,
    fontSize: 22,
    color: "#0A2463",
    marginBottom: 6
  },
  specsIcons: {
    fontSize: 20,
    color: "#0A2463"
  },
  specsWrapper: {
    // flex: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: "red"
  },
  specsBloc: {
    flex: 1,
    flexDirection: "row",
    alignItems:"center",
    // backgroundColor: "yellow"
  }
});
