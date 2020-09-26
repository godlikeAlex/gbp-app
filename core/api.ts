import AsyncStorage from "@react-native-community/async-storage";
import { updateTokens } from "../redux/actions";
import store from "../redux/store";
import { LOG_OUT } from "../redux/types";
import Constants from "expo-constants";

export const signIn = (data: any) => {
  return fetch("http://192.168.0.103:8888/api/v1/auth/sign-in", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((data) => {
      return data.json();
    })
    .catch((e) => {
      return e;
    });
};

export const signUp = (data: any) => {
  return fetch("http://192.168.0.103:8888/api/v1/auth/sign-up", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((data) => {
      return data.json();
    })
    .catch((e) => {
      return e;
    });
};

export const activateAccount = (data: any) => {
  return fetch("http://192.168.0.103:8888/api/v1/auth/activate-account", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((data) => {
      return data.json();
    })
    .catch((e) => {
      return e;
    });
};

export const refreshToken = (refreshToken: string, uniqueId: any) => {
  return fetch("http://192.168.0.103:8888/api/v1/auth/refresh-token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify({ refreshToken, uniqueId }),
  })
    .then((data) => {
      return data.json();
    })
    .catch((e) => {
      return e;
    });
};

const fetchWithAuth = async (url: string, options: any) => {
  const user = store.getState().userReducer || null;
  const token = user.auth.token;
  if (!token) {
    store.dispatch({ type: LOG_OUT });
  }

  if (!options.headers) options.headers;

  if (token) {
    if (user.auth.expiresIn) {
      if (Date.now() >= user.auth.expiresIn * 1000) {
        try {
          const data = await refreshToken(
            user.auth.refreshToken,
            Constants.installationId
          );

          if (data.error) {
            await AsyncStorage.removeItem("auth");
            store.dispatch({ type: LOG_OUT });
            console.log("error 2");
          }

          options.headers.Authorization = `Bearer ${data.token}`;
          await AsyncStorage.setItem("auth", JSON.stringify(data));
          store.dispatch(updateTokens(data));
          return await fetch(url, options);
        } catch (error) {
          console.log("error 1", error);
          await AsyncStorage.removeItem("auth");
          store.dispatch({ type: LOG_OUT });
        }
      }

      options.headers.Authorization = `Bearer ${token}`;
    } else {
      await AsyncStorage.removeItem("auth");
      console.log("error 3");
      store.dispatch({ type: LOG_OUT });
    }
  }

  return await fetch(url, options);
};

export const getProfile = (id: number) => {
  return fetchWithAuth(`http://192.168.0.103:8000/api/v1/user/show/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
  })
    .then((data: any) => {
      return data.json();
    })
    .catch((e) => {
      return e;
    });
};
