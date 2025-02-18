function getEnvValueWithDefault(key, defaultValue = undefined) {
    return process.env[key] || defaultValue;
  }
  
  export const config = {
    hosting: {
      front_port: getEnvValueWithDefault("REACT_APP_FRONT_PORT"),
      back_port: getEnvValueWithDefault("REACT_APP_BACK_PORT"),
      model_port: getEnvValueWithDefault("REACT_APP_MODEL_PORT"),
    },
    db: {
      url: getEnvValueWithDefault("REACT_APP_MONGO_URL"),
      db_name: getEnvValueWithDefault("REACT_APP_DATABASE_NAME"),
    },
    mailer: {
      site: getEnvValueWithDefault("REACT_APP_MAIL_SITE"),
      account: getEnvValueWithDefault("REACT_APP_GMAIL_ACCOUNT"),
      password: getEnvValueWithDefault("REACT_APP_GAMIL_PASSWORD"),
    },
    security: {
      salt_round: getEnvValueWithDefault("REACT_APP_SALT_ROUND"),
      jwt_secret_key: getEnvValueWithDefault("REACT_APP_JWT_SECRET_KEY"),
    },
    kakao: {
      rest_api_key: getEnvValueWithDefault("REACT_APP_REST_API_KEY"),
      redirect_uri: getEnvValueWithDefault("REACT_APP_REDIRECT_URI"),
    },
  };