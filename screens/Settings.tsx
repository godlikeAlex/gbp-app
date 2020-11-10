import React, { useEffect, useState } from 'react';
import { Layout, Text, Input, Button, Card } from '@ui-kitten/components';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import { ProfilePhoto } from '../src/components';
import { StyleGuide } from '../src/components/StyleGuide';
import { bindActionCreators } from "redux";
import * as actions from "../redux/actions";
import TopBar from '../src/components/TopBar';
import { connect } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { updateMyProfile } from '../core/api';
import localization from '../services/localization';

import * as MediaLibrary from 'expo-media-library';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

interface SettingsProps {
  profile: any;
  updateProfile: any;
}

const formData = new FormData();

const Settings = ({profile, updateProfile}: SettingsProps) => {
  const [state, setState] = useState({
    name: profile.name,
    account_name: profile.account_name,
    description: profile.description,
    error: '',
    avatar: profile.profile_photo
  });

  const {name, account_name, description, error, avatar} = state;

  useEffect(() => {
    formData.append('name', name);
    formData.append('account_name', account_name);
    formData.append('description', description);
    formData.append('_', '_');
  }, []);
  
  const onChange = (name: string, val: string) => {
    formData.append(name, val);
    setState({
      ...state,
      [name]: val
    });
  };

  const handlePress = () => {
    updateMyProfile(formData).then(data => {
      if(data.errors) {
        // data.errors.values();
        const errors: string[] = Object.values(data.errors);
        setState({
          ...state,
          error: errors[0]
        })
      } 

      console.log(data);

      if (!data.errors) {
        updateProfile(data.fields);
      }
    }).catch(e => console.log('e', e))
  };

  const handlelPressAvatar = async () => {
    const result = await MediaLibrary.getAssetsAsync({
      first: 25
    });
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [4, 4],
    //   quality: 1,
    // });

    // if (result.cancelled) {
    //   return;
    // }

    // let localUri: string = result.uri;

    // let filename = localUri.split('/').pop();

    // // Infer the type of the image
    // let match = /\.(\w+)$/.exec(filename);
    // let type = match ? `image/${match[1]}` : `image/png`;
    // formData.append('avatar', { uri: localUri, name: filename, type });

    // setState({
    //   ...state,
    //   avatar: result.uri
    // })
  }

  return <Layout style={{flex: 1}}>
    <TopBar title='Settings' />
    <Layout style={{...StyleGuide.padding.horizontal, alignItems: 'center'}}>
      {Boolean(error) && <Card status='danger' style={{width: '100%'}}>
        <Text style={{textAlign: 'center'}}>{localization.t(`errors.${error}`)}</Text>
      </Card>}
      <View style={{marginVertical: 10}} >
        <ProfilePhoto width={100} height={100} profilePhoto={avatar} />
      </View>
      <TouchableOpacity onPress={handlelPressAvatar}>
        <Text status='info'>Edit profile photo</Text>
      </TouchableOpacity>
      <Input label='Name' value={name} onChangeText={(text) => onChange('name', text)} />
      <Input label='User name' value={account_name} onChangeText={(text) => onChange('account_name', text)} />
      <Input label='Description' value={description} onChangeText={(text) => onChange('description', text)} />
      <Button onPress={handlePress} style={{marginTop: 10, width: '100%'}}>Save</Button>
    </Layout>
  </Layout>
};

const mapStateToProps = (state: { userReducer: any }) => {
  return {
    profile: state.userReducer.myProfile,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  const { logOut, initProfile, initPosts, updateProfile } = bindActionCreators(actions, dispatch);

  return {
    logOut,
    initProfile,
    initPosts,
    updateProfile
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);