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
