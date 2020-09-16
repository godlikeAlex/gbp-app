import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Input, Layout, Button, Text, Icon } from "@ui-kitten/components";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  marginInput: {
    marginTop: 10,
  },
  infoRegister: {
    textAlign: "center",
    color: "#b9b9b9",
  },
});

export default () => {
  const [inputData, setInputData] = useState({ email: "", password: "" });

  const handleChange = (name: string, value: string) => {
    setInputData({ ...inputData, [name]: value });
  };

  return (
    <Layout style={styles.container}>
      <Layout style={{ width: "100%" }}>
        <Input
          label="Email"
          placeholder="Ваш email адресс"
          value={inputData.email}
          onChangeText={(value) => handleChange("email", value)}
          style={styles.marginInput}
        />
        <Input
          label="Пароль"
          placeholder="********"
          value={inputData.password}
          onChangeText={(value) => handleChange("password", value)}
          secureTextEntry={true}
          style={styles.marginInput}
        />
        <Button status="primary" style={styles.marginInput}>
          Войти
        </Button>
        <Text style={[styles.marginInput, styles.infoRegister]} category="h6">
          Нет аккаунта? Регистрация
        </Text>
      </Layout>
    </Layout>
  );
};
