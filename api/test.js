module.exports = (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Minimal Vercel Serverless Function is working!",
    env: {
      hasMongoUri: !!process.env.MONGO_URI,
      nodeVersion: process.version,
    }
  });
};
