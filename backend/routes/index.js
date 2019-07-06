module.exports = (server) => {
  const version = `/v1`
  require(`.${version}/chat/evaluation`)(server, version)
  require(`.${version}/chat/answer`)(server, version)
  require(`.${version}/chat/insert`)(server, version)
}
