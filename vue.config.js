module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/fact_test/dist/'
        : '/'
}