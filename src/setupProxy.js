const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(
      "/earlyShake",
      createProxyMiddleware({
        target: "http://localhost:8080",
        ws: false,
      })
    );
  };
