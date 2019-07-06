const error = require('../../../utils/error')

module.exports = (server, version) => {
  const requestUrl = {
    default: `${version}/chat/answer`,
  }

  server.post(requestUrl.default, async (req, res, next) => {
    const body = req.body

    console.log('# body:', body)
    const message = body.message.data.text

    let result = body
    result.message.data.text = 'converted!'

    try {
      // E: custom part - sql

      res.json(result)
    } catch (e) {
      return next(error.errorBadRequest(res, e.message))
    }
  })
}
