module.exports = config => {
    config.target = "electron-renderer";
    config.publicPath = "./";
    return config;
  };