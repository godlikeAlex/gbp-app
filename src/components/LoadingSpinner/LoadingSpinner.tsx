import React from "react";
import { StyleSheet } from "react-native";
import { Avatar, Text, Layout, Button, Spinner } from "@ui-kitten/components";
import { theme } from "../StyleGuide";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...theme.center,
    backgroundColor: 'transparent'
  },
});

interface LoadingSpinnerProps {}

const LoadingSpinner = ({}: LoadingSpinnerProps) => {
  return (
    <Layout style={styles.container}>
      <Spinner size="giant" />
    </Layout>
  );
};

export default LoadingSpinner;
