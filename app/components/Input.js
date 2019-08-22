import React from "react";
import { StyleSheet , TextInput } from "react-native";
import { inputPlaceholder } from "../utils/Colors";

const styles = StyleSheet.create({
    input: {
      paddingTop: 10,
      paddingRight: 15,
      fontSize: 34,
      color: 'white',
      fontWeight: '500'
    }
  });

  const Input = ({ inputValue, onChangeText, onDoneAddItem }) => {
    return (<TextInput
        style={styles.input}
        value={inputValue}
        onChangeText={onChangeText}
        placeholder="Type here"
        placeholderTextColor={inputPlaceholder}
        multiline={true}
        autoCapitalize="sentences"
        underlineColorAndroid="transparent"
        selectionColor={'white'}
        maxLength={30}
        autoFocus={true}
        returnKeyType="done"
        blurOnSubmit={true}
        onSubmitEditing={onDoneAddItem}
    />
    );
  };

  export default Input;