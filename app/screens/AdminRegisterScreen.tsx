import {
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, setDoc, Timestamp } from "@firebase/firestore";
import { useFormik } from "formik";
import * as Yup from "yup";
import Headers from "../constants/Headers";
import { auth, db } from "../utils/Firebase";
import CustomTextInput from "../components/CustomTextInput";
import Colors from "../constants/Colors";
import CustomButton from "../components/CustomButton";
import AuthRedirect from "../components/AuthRedirect";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParamList } from "../types";

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  company: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Must be 6 characters or more")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

const errorCodes: object = {
  "auth/invalid-email": "Invalid email",
};

const AdminRegisterScreen = ({
  navigation,
}: NativeStackScreenProps<StackParamList, "AdminRegister">) => {
  const [firebaseError, setFirebaseError] = useState({ code: "", message: "" });

  const refCompany = useRef<TextInput>();
  const refEmail = useRef<TextInput>();
  const refPassword = useRef<TextInput>();
  const refConfirmPassword = useRef<TextInput>();

  const formik = useFormik({
    initialValues: {
      name: "",
      company: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: (values, { resetForm }) => {
      signUp(values);
      resetForm();
    },
  });

  // Sign up with email
  const signUp = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((cred) => {
        updateProfile(getAuth().currentUser as User, { displayName: name });
        setDoc(doc(db, "users", cred.user.uid), {
          dateCreated: Timestamp.fromDate(new Date()),
          displayName: name,
          streak: 0,
          isAdmin: true,
        });
      })
      .catch((err) => setFirebaseError(err));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <Text style={[Headers.h1, styles.h1]}>Create Admin Account</Text>
        <CustomTextInput
          formik={formik}
          icon="user"
          name="name"
          placeholder="Name"
          value={formik.values.name}
          onSubmitEditing={() => refCompany.current?.focus()}
        />
        {formik.touched.name && formik.errors.name ? (
          <Text style={[Headers.p, styles.error]}>{formik.errors.name}</Text>
        ) : null}
        <CustomTextInput
          formik={formik}
          icon="building"
          name="company"
          placeholder="Company"
          refValue={refCompany}
          value={formik.values.company}
          onSubmitEditing={() => refEmail.current?.focus()}
        />
        {formik.touched.company && formik.errors.company ? (
          <Text style={[Headers.p, styles.error]}>{formik.errors.name}</Text>
        ) : null}
        <CustomTextInput
          formik={formik}
          icon="envelope"
          keyboardType="email-address"
          name="email"
          placeholder="E-mail"
          refValue={refEmail}
          value={formik.values.email}
          onSubmitEditing={() => refPassword.current?.focus()}
        />
        {formik.touched.email && formik.errors.email ? (
          <Text style={[Headers.p, styles.error]}>{formik.errors.email}</Text>
        ) : null}
        <CustomTextInput
          formik={formik}
          icon="lock"
          isPass
          name="password"
          placeholder="Password"
          refValue={refPassword}
          value={formik.values.password}
          onSubmitEditing={() => refConfirmPassword.current?.focus()}
        />
        {formik.touched.password && formik.errors.password ? (
          <Text style={[Headers.p, styles.error]}>
            {formik.errors.password}
          </Text>
        ) : null}
        <CustomTextInput
          formik={formik}
          icon="lock"
          isPass
          name="confirmPassword"
          placeholder="Confirm Password"
          refValue={refConfirmPassword}
          value={formik.values.confirmPassword}
          onSubmitEditing={formik.handleSubmit}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
          <Text style={[Headers.p, styles.error]}>
            {formik.errors.confirmPassword}
          </Text>
        ) : null}
        <View style={styles.bottom}>
          <View style={styles.admin}>
            <TouchableOpacity
              onPress={() => navigation.navigate("UserRegister")}
            >
              <Text
                style={[
                  Headers.p,
                  {
                    color: Colors.primary,
                    fontSize: 15,
                  },
                ]}
              >
                Register
              </Text>
            </TouchableOpacity>
            <Text
              style={[
                Headers.p,
                {
                  fontSize: 15,
                },
              ]}
            >
              {" "}
              as a user
            </Text>
          </View>

          <CustomButton
            disabled={
              !formik.values.name ||
              !formik.values.email ||
              !formik.values.password ||
              !formik.values.confirmPassword
            }
            text="Register"
            onPress={formik.handleSubmit}
          />
        </View>
        <Text style={[Headers.p, styles.error]}>
          {Object.keys(errorCodes).includes(firebaseError.code)
            ? errorCodes[firebaseError.code as keyof object]
            : firebaseError.message}
        </Text>
        <AuthRedirect toScreen="Login" />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default AdminRegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, marginHorizontal: 10 },
  h1: { marginTop: 20, marginBottom: 10 },
  bottom: { marginTop: "auto" },
  admin: { flexDirection: "row", justifyContent: "center", marginBottom: 30 },
  error: {
    color: "red",
    marginLeft: 10,
    fontSize: 15,
  },
});
