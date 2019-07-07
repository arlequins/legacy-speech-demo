const error = require('../../../utils/error')
const pool = require('../../../utils/database')

module.exports = (server, version) => {
  const requestUrl = {
    default: `${version}/chat/evaluation`,
  }

  server.get(requestUrl.default, async (req, res, next) => {
    const body = req.query

    // count
    const selectTotal = await pool.query(`SELECT COUNT(*) as count FROM speech.evaluation`)
    const total = selectTotal && selectTotal.length > 0 ? selectTotal[0].count : 0

    const selectGood = await pool.query(`SELECT COUNT(*) as count FROM speech.evaluation WHERE evaluation = 1`)
    const good = selectGood && selectGood.length > 0 ? selectGood[0].count : 0

    const selectBad = await pool.query(`SELECT COUNT(*) as count FROM speech.evaluation WHERE evaluation = 2`)
    const bad = selectBad && selectBad.length > 0 ? selectBad[0].count : 0
    // E: count

    const selectList = await pool.query(`SELECT id, question, answer, evaluation FROM speech.evaluation`)

    try {
      const result = {
        status: 200,
        list: selectList && selectList.length > 0 ? selectList : [],
        summary: {
          total: total,
          good: good,
          bad: bad,
        }
      }

      res.json(result)
    } catch (e) {
      return next(error.errorBadRequest(res, e.message))
    }
  })

  server.post(requestUrl.default, async (req, res, next) => {
    const body = req.body

    try {
      // insert row
      const question = body.question
      const answer = body.answer
      const evaluation = body.evaluation

      const createQuery = `INSERT INTO speech.evaluation (question, answer, evaluation)
      VALUES ('${question}', '${answer}', ${evaluation});`

      const insertStatus = await pool.query(createQuery)
      const insertRow = insertStatus.affectedRows
      // E: insert row

      // current rows
      const selecting = await pool.query(`SELECT COUNT(*) as count FROM speech.evaluation`)
      const currentRows = selecting[0].count
      // E: current rows

      const result = {
        rows: currentRows,
        insert: insertRow,
        status: 200,
        question: question,
        answer: answer,
      }

      res.json(result)
    } catch (e) {
      return next(error.errorBadRequest(res, e.message))
    }
  })
}
