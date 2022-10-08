import { StyleSheet } from "react-native";
import common from "./common.styles";
export default StyleSheet.create({
  firstBtn: {
    ...common.btn,
    backgroundColor: "blue"
  },
  secondBtn: {
    ...common.btn,
    backgroundColor: "red"
  },
  unstyle: {
    backgroundColor: "red"
  }
});
