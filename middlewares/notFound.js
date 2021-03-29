module.exports = (reques, response, next) => {
  response.status(404).json({
    error: 'Not Found'
  })
}
