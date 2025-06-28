const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/app_request",
    createProxyMiddleware({
      target: "https://shopapi.aipsoft.com",
      changeOrigin: true,
      secure: false,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
    })
  );
};
