import AsyncStorage from "@react-native-community/async-storage";
import { updateTokens } from "../redux/actions";
import store from "../redux/store";
import { LOG_OUT } from "../redux/types";
import Constants from "expo-constants";
import querystring from "query-string";

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
            return;
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

export const getPrivewProfilePosts = (id: number) => {
  return fetchWithAuth(
    `http://192.168.0.103:8000/api/v1/account/posts/preview/${id}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }
  )
    .then((data: any) => {
      return data.json();
    })
    .catch((e) => {
      return e;
    });
};

export const getPhoto = (uri: string) => {
  return `http://192.168.0.103:8000/${uri}`;
};

export const getPost = (id: any) => {
  return fetchWithAuth(`http://192.168.0.103:8000/api/v1/post/show/${id}`, {
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

export const toggleLike = (id: any, type: string = "post") => {
  return fetchWithAuth(
    type === "post"
      ? `http://192.168.0.103:8000/api/v1/post/toggle/like/${id}`
      : `http://192.168.0.103:8000/api/v1/post/comment/toggle/like/${id}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }
  )
    .then((data: any) => {
      return data.json();
    })
    .catch((e) => {
      return e;
    });
};

export const getComments = (id: number | string, data: { page?: number }) => {
  const params = querystring.stringify(data);

  return fetchWithAuth(
    `http://192.168.0.103:8000/api/v1/post/show/comments/${id}?${params}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }
  )
    .then((data: any) => {
      return data.json();
    })
    .catch((e) => {
      return e;
    });
};

export const createComment = (id: string | number, comment: string) => {
  return fetchWithAuth(
    `http://192.168.0.103:8000/api/v1/post/comment/${id}/create`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ comment }),
    }
  )
    .then((data: any) => {
      return data.json();
    })
    .catch((e) => {
      return e;
    });
};

export const getFollowers = (id: any, data: { page: number }) => {
  const params = querystring.stringify(data);

  return fetch(
    `http://192.168.0.103:8000/api/v1/user/followers/${id}?${params}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    }
  )
    .then((data: any) => {
      return data.json();
    })
    .catch((e) => {
      return e;
    });
};
