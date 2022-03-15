import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import Headers from "../constants/Headers";

interface Props {
  editable?: boolean;
  formik: any;
  icon?: string;
  isPass?: boolean;
  keyboardType?: string;
  name: string;
  placeholder: string;
  refValue?: any;
  style?: any;
  value: any;
  onSubmitEditing: any;
}

const CustomTextInput = ({
  editable = true,
  formik,
  icon,
  isPass,
  keyboardType,
  name,
  placeholder,
  refValue,
  style,
  value,
  onSubmitEditing,
}: Props) => {
  const [showPass, setShowPass] = useState(false);

  return (
    <KeyboardAvoidingView style={styles.container}>
      {icon && (
        <View style={styles.icon}>
          <FontAwesome5 name={icon} solid size={24} color={Colors.lightGray} />
        </View>
      )}
      <TextInput
        autoCorrect={false}
        editable={editable}
        enablesReturnKeyAutomatically={true}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={Colors.lightGray}
        ref={refValue}
        returnKeyType="next"
        secureTextEntry={isPass && !showPass}
        style={[Headers.p, styles.input, style]}
        value={value}
        onChangeText={(text) => {
          // setFirebaseError({});
          formik.setFieldValue(name, text);
        }}
        onSubmitEditing={onSubmitEditing}
      />
      {isPass && (
        <TouchableOpacity
          style={styles.showPass}
          onPress={() => setShowPass(!showPass)}
        >
          <FontAwesome5
            name={showPass ? "eye" : "eye-slash"}
            solid
            size={24}
            color={Colors.lightGray}
          />
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 10,
    paddingVertical: 10,
    backgroundColor: Colors.darkGray,
  },
  icon: {
    width: 30,
    marginLeft: 10,
    alignItems: "center",
  },
  input: { flex: 1, paddingHorizontal: 10 },
  showPass: { marginRight: 10 },
});
