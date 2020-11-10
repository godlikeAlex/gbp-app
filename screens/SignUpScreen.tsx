import React, { useState } from "react";
import { StyleSheet } from "react-native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-community/async-storage";
import { Input, Layout, Button, Text, Icon } from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";
import localization from "../services/localization";
import { signUp } from "../core/api";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Loading from "../src/components/Loading";
import { StyleGuide } from "../src/components/StyleGuide";
import TopBar from "../src/components/TopBar";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: StyleGuide.spacing,
    alignItems: "center",
    paddingTop: 10,
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

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState({
    name: "",
    account_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);

  const handleChange = (name: string, value: string) => {
    setInputData({ ...inputData, [name]: value });
  };

  const handleSignIn = async () => {
    setDisabled(true);
    setLoading(true);

    if (
      !inputData.email ||
      !inputData.password ||
      !inputData.account_name ||
      !inputData.name
    ) {
      setError(localization.t("authorization.errors.empty"));
      setLoading(false);
      setDisabled(false);
      return;
    }
    try {
      const data = await signUp({
        ...inputData,
        uniqueId: Constants.installationId,
      });

      if (data.errors) {
        setError(localization.t(`errors.${data.errors[0].msg}`));
        setDisabled(false);
        setLoading(false);
        return;
      }

      if (data.err) {
        setDisabled(false);
        setLoading(false);
        return setError(data.err);
      }

      navigation.navigate("ConfirmEmail", {
        email: inputData.email,
        token: data.token,
      });
      setDisabled(false);
      setLoading(false);
    } catch (error) {
      setDisabled(false);
      setLoading(false);
      setError(error);
    }
  };

  return (
    <Layout style={{ flex: 1 }}>
      {loading && <Loading />}
      <TopBar />
      <Layout style={styles.container}>
        <Layout style={{ width: "100%" }}>
          <Text category="h2" style={{ fontFamily: "SFProText-Semibold" }}>
            {localization.t("authorization.signUpTitle")}
          </Text>
          <Input
            label={localization.t("authorization.name")}
            placeholder={localization.t("authorization.formNamePlaceholder")}
            value={inputData.name}
            onChangeText={(value) => handleChange("name", value)}
            style={styles.marginInput}
          />
          <Input
            label={localization.t("authorization.account_name")}
            placeholder={localization.t(
              "authorization.formAcountNamePlaceholder"
            )}
            value={inputData.account_name}
            onChangeText={(value) => handleChange("account_name", value)}
            style={styles.marginInput}
          />
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
            {localization.t("authorization.signUp")}
          </Button>
          <Layout style={[styles.marginInput]}>
            <Text style={styles.infoRegister} category="h6">
              {localization.t("authorization.createAccount.hint")}
            </Text>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.signUp} category="h6" status="primary">
                {localization.t("authorization.signIn")}
              </Text>
            </TouchableWithoutFeedback>
          </Layout>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default SignUpScreen;
