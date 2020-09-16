import i18n from "i18n-js";

// Set the key-value pairs for the different languages you want to support.
i18n.translations = {
  en: {
    authorization: {
      email: "Email",
      password: "Password",
      formEmailPlaceholder: "Your email address",
      signIn: "Sign in",
      signUp: "Sign up",
      login: { hint: "Don't have an account?" },
    },
  },
  ru: { email: "Почта" },
};

export default i18n;
