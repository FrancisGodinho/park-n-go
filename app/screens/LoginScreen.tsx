import React, { useRef, useState } from "react";
import {
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signInWithEmailAndPassword } from "@firebase/auth";

import { auth } from "../utils/Firebase";
import Headers from "../constants/Headers";
import Colors from "../constants/Colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomHeader from "../components/CustomHeader";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";
import AuthRedirect from "../components/AuthRedirect";
import { StackParamList } from "../types";
import { FontAwesome5 } from "@expo/vector-icons";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const errorCodes: object = {
  "auth/wrong-password": "The password is invalid",
  "auth/user-not-found":
    "There is no existing user record corresponding to the email",
};

const LoginScreen = ({
  navigation,
}: NativeStackScreenProps<StackParamList, "Login">) => {
  const [firebaseError, setFirebaseError] = useState({ code: "", message: "" });

  const refPassword = useRef<TextInput>(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values, { resetForm }) => {
      signIn(values);
      resetForm();
    },
  });

  const signIn = ({ email, password }: { email: string; password: string }) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setFirebaseError({ code: "", message: "" });
      })
      .catch((err) => setFirebaseError(err));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <SafeAreaView style={styles.imgCont}>
          <FontAwesome5 name="car" size={100} color={Colors.lightBlack} />
        </SafeAreaView>
        <SafeAreaView style={styles.bottomContOuter}>
          <View style={styles.bottomCont}>
            <CustomHeader backDisabled={true} text="Welcome Back" />
            <CustomTextInput
              formik={formik}
              icon="envelope"
              keyboardType="email-address"
              name="email"
              placeholder="E-mail"
              value={formik.values.email}
              onSubmitEditing={() => refPassword.current?.focus()}
            />
            {formik.touched.email && formik.errors.email ? (
              <Text style={[Headers.p, styles.error]}>
                {formik.errors.email}
              </Text>
            ) : null}
            <CustomTextInput
              formik={formik}
              icon="lock"
              isPass
              name="password"
              placeholder="Password"
              refValue={refPassword}
              value={formik.values.password}
              onSubmitEditing={formik.handleSubmit}
            />
            {formik.touched.password && formik.errors.password ? (
              <Text style={[Headers.p, styles.error]}>
                {formik.errors.password}
              </Text>
            ) : null}
            <CustomButton
              disabled={!formik.values.email || !formik.values.password}
              style={
                !formik.values.email || !formik.values.password
                  ? { backgroundColor: Colors.lightGray }
                  : null
              }
              text="Login"
              onPress={formik.handleSubmit}
            />
            <Text style={[Headers.p, styles.error]}>
              {Object.keys(errorCodes).includes(firebaseError.code)
                ? errorCodes[firebaseError.code as keyof object]
                : firebaseError.message}
            </Text>
            <AuthRedirect toScreen="UserRegister" />
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  imgCont: { flex: 1, justifyContent: "center", alignItems: "center" },
  img: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
  },
  bottomContOuter: {
    flex: 2,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: Colors.lightBlack,
  },
  bottomCont: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  forgotPass: { textAlign: "right", color: Colors.primary, marginBottom: 10 },
  error: {
    color: "red",
    marginLeft: 10,
    fontSize: 15,
  },
});
