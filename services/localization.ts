import i18n from "i18n-js";

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en: {
    authorization: {
      email: "Email",
      name: "Name",
      account_name: "Account name",
      password: "Password",
      formEmailPlaceholder: "Your email address",
      formNamePlaceholder: "Your name",
      formAcountNamePlaceholder: "Your account name",
      signIn: "Sign in",
      signUp: "Sign up",
      login: { hint: "Don't have an account?" },
      createAccount: { hint: "All ready have an account?" },
      errors: {
        empty: "Missing required fields",
      },
      confirmemailTitle: "Verify your email",
      confirmemail: "Please enter the code from email",
      checkConfirm: "Check verify code",
      wrongCode: "Invalid conformation code",
      expired: "Expired, please sign up again.",
      signInTitle: "Sign in",
      signUpTitle: "Sign up",
    },
    user: {
      followers: "Followers",
      followings: "Followings",
    },
  },
  ru: { email: "Почта" },
};

export default i18n;
