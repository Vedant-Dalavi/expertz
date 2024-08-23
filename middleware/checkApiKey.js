// middleware/checkApiKey.js
module.exports = (req, res, next) => {
    const apiKey = req.headers['api_key'];
    if (apiKey && apiKey === process.env.API_KEY) { // Compare with your stored API key
        return next();
    } else {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: API key is missing or invalid'
        });
    }
};
