import React from "react";
import { StyleSheet, View } from "react-native";
import { Layout, Spinner } from "@ui-kitten/components";

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: 125,
    height: 125,
    borderRadius: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, .5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

interface LoadingProps {}

const Loading = ({}: LoadingProps) => {
  return (
    <View style={styles.overlay}>
      <Layout style={styles.container} level="1">
        <Spinner size="giant" />
      </Layout>
    </View>
  );
};

export default Loading;
