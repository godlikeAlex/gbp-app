import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigation/StackNavigator";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";

import { Provider } from "react-redux";
import store from "./redux/store";

export default function App() {
  const [fontsLoaded] = useFonts({
    "SFProText-Bold": require("./assets/fonts/SF-Pro-Text-Bold.otf"),
    "SFProText-Semibold": require("./assets/fonts/SF-Pro-Text-Semibold.otf"),
    "SFProText-Regular": require("./assets/fonts/SF-Pro-Text-Regular.otf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <Provider {...{ store }}>
            <NavigationContainer>
              <StackNavigator />
            </NavigationContainer>
          </Provider>
        </ApplicationProvider>
      </>
    );
  }
}
