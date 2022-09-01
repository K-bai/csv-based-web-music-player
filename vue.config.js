const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = {
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "MeUmy的录音棚";
      return args;
    });
    let svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.use("svg-url-loader").loader("svg-url-loader").options({
      limit: 10240,
    });
  },
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
  },
  productionSourceMap: false,
};
