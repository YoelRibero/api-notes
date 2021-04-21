const ERROR_HANDLERS = {
  CastError: res => res.status(400).json({
    error: 'Id used malformed'
  }),
  ValidateError: (res, err) => res.status(409).send({
    error: err.message
  }),
  JsonWebTokenError: res => res.status(401).json({
    error: 'token missing or invalid'
  }),
  TokenExpiresError: res => res.status(401).json({
    error: 'token expired'
  }),
  defaultError: res => res.status(500).json({
    error: 'Server Error'
  })
}

module.exports = (error, request, res, next) => {
  console.error(error.name)
  const handle = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError
  handle(res, error)
}
