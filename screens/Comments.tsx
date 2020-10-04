import React from "react";
import { StyleSheet, TouchableWithoutFeedback, Button } from "react-native";
import TopBar from "../src/components/TopBar";
import { Layout, Input, Icon, Text } from "@ui-kitten/components";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigator";
import { RouteProp } from "@react-navigation/native";
import { createComment, getComments } from "../core/api";
import { ProfilePhoto } from "../src/components";
import { StyleGuide } from "../src/components/StyleGuide";
import { TouchableOpacity } from "react-native-gesture-handler";
import { connect } from "react-redux";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    width: "100%",
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    bottom: 0,
    ...StyleGuide.padding.horizontal,
    paddingVertical: 5,
    alignSelf: "stretch",
  },
});

type CommentsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Comments"
>;
type CommentsScreenRouteProp = RouteProp<RootStackParamList, "Comments">;

type Props = {
  navigation: CommentsScreenNavigationProp;
  route: CommentsScreenRouteProp;
  auth: any;
};

const Comments = ({ route, auth }: Props) => {
  const [value, setValue] = React.useState("");
  const { postId } = route.params;

  const coments = getComments(postId, { page: 1 }).then((data) =>
    console.log(data)
  );

  const submit = async () => {
    if (value.length < 1) return;

    const response = await createComment(postId, value);

    console.log(response);
  };

  const renderIcon = (props: any) => (
    <TouchableWithoutFeedback>
      <Icon {...props} name={"arrow-ios-forward-outline"} />
    </TouchableWithoutFeedback>
  );

  return (
    <Layout style={{ flex: 1 }}>
      <TopBar title="Comments" />
      <Layout style={styles.inputContainer} level="2">
        <ProfilePhoto width={40} height={40} />
        <Input
          value={value}
          style={{
            borderColor: "transparent",
            alignSelf: "stretch",
            backgroundColor: "transparent",
            flex: 1,
          }}
          placeholder="Add comment..."
          onChangeText={(nextValue) => setValue(nextValue)}
        />
        <TouchableOpacity onPress={submit}>
          <Text status="primary">Post</Text>
        </TouchableOpacity>
      </Layout>
    </Layout>
  );
};

const mapStateToProps = ({ userReducer }: { userReducer: { auth: any } }) => {
  return { auth: userReducer.auth };
};

export default connect(mapStateToProps)(Comments);
