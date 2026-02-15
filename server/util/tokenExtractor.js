exports.tokenExtractor = (req) => {
    return req.headers?.auth || null;
}