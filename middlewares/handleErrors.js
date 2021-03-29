module.exports = (error, request, response, next) => {
  console.error(error)
  if (error.name === 'CastError') {
    response.status(400).json({
      error: 'Id used malformed'
    })
  } else {
    response.status(500).json({
      error: 'Server Error'
    })
  }
}
