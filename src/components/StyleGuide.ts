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
  flexDirectionRow: {
    flexDirection: "row",
  },
});

export const StyleGuide = {
  spacing: 15,
  // Margins
  margin: {
    top: {
      marginTop: 15,
    },
  },

  // Paddings
  padding: {
    top: {
      paddingTop: 15,
    },
    bottom: {
      paddingBottom: 15,
    },
    vertical: {
      paddingVertical: 15,
    },
    horizontal: {
      paddingHorizontal: 15,
    },
  },
};
