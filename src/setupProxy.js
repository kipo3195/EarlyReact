const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {

  const wServerUrl = process.env.REACT_APP_SERVER_A_URL;
    app.use(
      "/earlyShake",
      createProxyMiddleware({
        target: wServerUrl,
        ws: true

      })
    );
  };
