// Serverless entrypoint for Vercel
const handler = require('../dist/main');

module.exports = (req, res) => {
  // If the request was rewritten to /api, restore the original incoming path
  if (req.url.startsWith('/api')) {
    const stripped = req.url.replace(/^\/api/, '') || '/';
    // If the stripped path is not swagger/api doc path, use it
    if (stripped !== '/' && !stripped.startsWith('/docs') && !stripped.startsWith('/swagger')) {
      req.url = stripped;
    }
  }

  const fn = typeof handler === 'function' ? handler : (handler && handler.default ? handler.default : null);
  if (typeof fn === 'function') {
    return fn(req, res);
  }
  return res.status(500).json({ error: 'Handler function could not be loaded from dist/main' });
};
