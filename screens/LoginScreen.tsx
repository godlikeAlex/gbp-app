import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-community/async-storage";
import { Input, Layout, Button, Text, Icon } from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";
import localization from "../services/localization";
import * as actions from "../redux/actions";
import { signIn } from "../core/api";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    alignItems: "center",
    paddingTop: 50,
  },
  marginInput: {
    marginTop: 10,
  },
  infoRegister: {
    textAlign: "center",
    color: "#b9b9b9",
  },
  signUp: {
    textAlign: "center",
  },
});

interface LoginProps {
  login: Function;
  user: object;
}

const LoginScreen = ({ login, user }: LoginProps) => {
  const navigation = useNavigation();
  const [inputData, setInputData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);

  const handleChange = (name: string, value: string) => {
    setInputData({ ...inputData, [name]: value });
  };

  const handleSignIn = async () => {
    setDisabled(true);
    if (!inputData.email || !inputData.password) {
      setError(localization.t("authorization.errors.empty"));
      setDisabled(false);
      return;
    }
    try {
      const data = await signIn({
        ...inputData,
        uniqueId: Constants.sessionId,
      });
      if (data.err) {
        setDisabled(false);
        return setError(data.err);
      }
      AsyncStorage.setItem("auth", JSON.stringify(data)).then(() => {
        login(data);
        navigation.navigate("Home");
      });
    } catch (error) {
      setDisabled(false);
      setError(error);
    }
  };

  return (
    <Layout style={styles.container}>
      <Layout style={{ width: "100%" }}>
        <Text category="h2" style={{ fontFamily: "SFProText-Semibold" }}>
          {localization.t("authorization.signInTitle")}
        </Text>
        <Input
          label={localization.t("authorization.email")}
          placeholder={localization.t("authorization.formEmailPlaceholder")}
          value={inputData.email}
          onChangeText={(value) => handleChange("email", value)}
          style={styles.marginInput}
        />
        <Input
          label={localization.t("authorization.password")}
          placeholder="********"
          value={inputData.password}
          onChangeText={(value) => handleChange("password", value)}
          secureTextEntry={true}
          style={styles.marginInput}
        />
        <Text style={{ color: "red" }} status="danger">
          {error && error}
        </Text>
        <Button
          status="primary"
          style={styles.marginInput}
          onPress={handleSignIn}
          disabled={disabled}
        >
          {localization.t("authorization.signIn")}
        </Button>
        <Layout style={[styles.marginInput]}>
          <Text style={styles.infoRegister} category="h6">
            {localization.t("authorization.login.hint")}
          </Text>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={styles.signUp} category="h6" status="primary">
              {localization.t("authorization.signUp")}
            </Text>
          </TouchableWithoutFeedback>
        </Layout>
      </Layout>
    </Layout>
  );
};

const mapStateToProps = (state: { userReducer: any }) => {
  return {
    user: state.userReducer,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  const { login } = bindActionCreators(actions, dispatch);

  return {
    login,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
