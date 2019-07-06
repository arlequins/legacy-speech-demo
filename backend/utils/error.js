module.exports.errorBadRequest = (res, msg) => {
  const code = 400
  res.status(code)
  res.json({
    status: code,
    error: msg ? msg : '',
  })
}
