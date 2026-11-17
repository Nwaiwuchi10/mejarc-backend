// Serverless entrypoint for Vercel
const handler = require('../dist/main');

module.exports = (req, res) => {
  const fn = typeof handler === 'function' ? handler : (handler && handler.default ? handler.default : null);
  if (typeof fn === 'function') {
    return fn(req, res);
  }
  return res.status(500).json({ error: 'Handler function could not be loaded from dist/main' });
};
