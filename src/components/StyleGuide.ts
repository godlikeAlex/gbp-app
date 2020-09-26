import { StyleSheet } from "react-native";

export const theme = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "SFProText-Regular",
  },
  boldText: {
    fontFamily: "SFProText-Bold",
    fontWeight: "bold",
  },
  centerText: {
    textAlign: "center",
  },
});

export const StyleGuide = {
  spacing: 20,
  // Margins
  margin: {
    top: {
      marginTop: 20,
    },
  },

  // Paddings
  padding: {
    top: {
      paddingTop: 20,
    },
    bottom: {
      paddingBottom: 20,
    },
    vertical: {
      paddingVertical: 20,
    },
    horizontal: {
      paddingHorizontal: 20,
    },
  },
};
