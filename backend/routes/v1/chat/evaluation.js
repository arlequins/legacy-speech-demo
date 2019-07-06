const error = require('../../../utils/error')

module.exports = (server, version) => {
  const requestUrl = {
    default: `${version}/chat/evaluation`,
  }

  server.get(requestUrl.default, async (req, res, next) => {
    const body = req.query
    const uri = requestUrl.default

    // custom parts
    const params = {
      email: '',
    }
    // E: custom parts

    try {
      // E: custom part - sql

      res.json({
        msg: 'data',
      })
    } catch (e) {
      return next(error.errorBadRequest(res, e.message))
    }
  })

  server.post(requestUrl.default, async (req, res, next) => {
    const body = req.body
    const uri = requestUrl.default

    console.log('# body:', body)

    const result = {
      status: 200,
    }

    try {
      // E: custom part - sql

      res.json(result)
    } catch (e) {
      return next(error.errorBadRequest(res, e.message))
    }
  })
}
