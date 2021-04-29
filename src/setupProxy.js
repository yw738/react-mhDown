const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target: "http://localhost:80",
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/",
      },
    })
  );
};
