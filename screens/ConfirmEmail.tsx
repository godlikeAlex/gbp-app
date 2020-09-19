import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { StyleSheet, SafeAreaView, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { bindActionCreators } from "redux";
import { StackScreenProps } from "@react-navigation/stack";
import Constants from "expo-constants";
import { Layout, Button, Text } from "@ui-kitten/components";
import localization from "../services/localization";

import * as actions from "../redux/actions";
import { activateAccount } from "../core/api";
import Image from "./assets/confirm-email.svg";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { connect } from "react-redux";
import TopBar from "../src/components/TopBar";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
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
  root: { padding: 20 },
  title: {
    textAlign: "center",
    fontSize: 30,
    fontFamily: "SFProText-Semibold",
  },
  codeFieldRoot: {
    marginTop: 20,
    width: 280,
    marginLeft: "auto",
    marginRight: "auto",
  },
  cellRoot: {
    paddingHorizontal: 10,
    minWidth: 30,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  cellText: {
    color: "#000",
    fontSize: 36,
    textAlign: "center",
  },
  focusCell: {
    borderBottomColor: "#007AFF",
    borderBottomWidth: 2,
  },
  subTitle: {
    fontSize: 20,
    marginTop: 10,
    textAlign: "center",
  },
});

const CELL_COUNT = 4;

type RootStackParamList = {
  data: { email: string; token: string };
};

type PropsRoute = StackScreenProps<RootStackParamList, "data">;

interface Props extends PropsRoute {
  login: Function;
}

const ConfirmEmail = ({ route, login }: Props) => {
  const navigation = useNavigation();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });
  const { email, token } = route.params;

  const handleActivateAccount = async () => {
    const uniqueId = Constants.sessionId;

    const data = await activateAccount({
      token,
      code: Number(code),
      uniqueId,
    });

    if (data.err) return setError(localization.t("authorization.wrongCode"));

    if (data.error) return setError(localization.t("authorization.expired"));

    AsyncStorage.setItem("auth", JSON.stringify(data)).then(() => {
      login({ ...data, uniqueId });
      navigation.navigate("Home");
    });
  };

  useEffect(() => {
    if (code.length === 4) handleActivateAccount();
  });

  return (
    <Layout style={styles.container}>
      <TopBar />

      <Layout
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image width="50%" height="35%" />
        <SafeAreaView style={styles.root}>
          <Text style={styles.title}>
            {localization.t("authorization.confirmemailTitle")}
          </Text>
          <Text style={styles.subTitle}>
            {localization.t("authorization.confirmemail")}
          </Text>
          <Text style={[styles.subTitle]} status="info">
            {email}
          </Text>
          {error.length !== 0 && (
            <Text
              style={{ textAlign: "center", marginTop: 10, fontSize: 18 }}
              status="danger"
            >
              {error}
            </Text>
          )}
          <CodeField
            ref={ref}
            {...props}
            value={code}
            onChangeText={setCode}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <View
                // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
                onLayout={getCellOnLayoutHandler(index)}
                key={index}
                style={[styles.cellRoot, isFocused && styles.focusCell]}
              >
                <Text style={styles.cellText}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )}
          />
        </SafeAreaView>
      </Layout>
      <Button
        style={{
          position: "absolute",
          width: "100%",
          bottom: 0,
          borderRadius: 0,
        }}
        onPress={handleActivateAccount}
      >
        {localization.t("authorization.checkConfirm")}
      </Button>
    </Layout>
  );
};

const mapDispatchToProps = (dispatch: any) => {
  const { login } = bindActionCreators(actions, dispatch);

  return {
    login,
  };
};

export default connect(null, mapDispatchToProps)(ConfirmEmail);
