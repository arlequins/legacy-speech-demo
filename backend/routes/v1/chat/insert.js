const error = require('../../../utils/error')

module.exports = (server, version) => {
  const requestUrl = {
    default: `${version}/chat/insert`,
  }

  server.post(requestUrl.default, async (req, res, next) => {
    const body = req.body

    try {
      res.json({
        question: body.question,
        answer: `answer ${body.messageList.length + 1}の答え`,
        messageList: body.messageList,
      })
    } catch (e) {
      return next(error.errorBadRequest(res, e.message))
    }
  })
}
