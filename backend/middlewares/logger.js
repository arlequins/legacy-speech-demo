const morgan = require('morgan')
const path = require('path')
const stackTrace = require('stack-trace')
const {
  createLogger,
  format,
  transports
} = require('winston')
require('winston-daily-rotate-file')

const target = 'api'
const prefix = `${target}`
const LOGS_DIR = process.env.LOG_LEVEL !== 'nodemon' ? `/var/log/${target}` : path.join(__dirname, '..', 'log')
const debugFlag = process.env.DEBUG_FLAG

const myFormat = format.printf(info => {
  return info.message.replace('\n', '')
})

const WINSTON_LOGGER_CONFIG = {
  format: format.combine(
    myFormat
  ),
  exitOnError: false,
}

const LOGGER_COMMON_CONFIG = {
  colorize: false,
  prepend: true,
  datePattern: 'YYYY-MM-DD',
  handleExceptions: true,
  maxsize: 1024 * 1024 * 10,
  maxFiles: '14d',
}

morgan.token('real-ip', (req, res) => {
  if (req.headers.hasOwnProperty('x-real-ip')) {
    return req.headers['x-real-ip']
  } else {
    return req.ip
  }
})

morgan.token('x-forwarded-for', (req, res) => {
  if (req.headers.hasOwnProperty('x-forwarded-for')) {
    return req.headers['x-forwarded-for']
  } else {
    return req.ip
  }
})

morgan.format('myformat', ':real-ip - :x-forwarded-for - :remote-user [:date[Asia/Tokyo]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"')

const logger = createLogger({
  transports: [
    new transports.DailyRotateFile({
      name: 'error',
      level: 'error',
      filename: `${LOGS_DIR}/${prefix}-error.log`,
      ...LOGGER_COMMON_CONFIG,
    }),
    new transports.DailyRotateFile({
      name: 'warn',
      level: 'warn',
      filename: `${LOGS_DIR}/${prefix}-warn.log`,
      ...LOGGER_COMMON_CONFIG,
    }),
    new transports.DailyRotateFile({
      name: 'normal',
      level: 'info',
      filename: `${LOGS_DIR}/${prefix}-normal.log`,
      ...LOGGER_COMMON_CONFIG,
    }),
  ],
  ...WINSTON_LOGGER_CONFIG,
})

const accessLogger = createLogger({
  transports: [
    new transports.DailyRotateFile({
      name: 'access',
      level: 'info',
      filename: `${LOGS_DIR}/${prefix}-access.log`,
      ...LOGGER_COMMON_CONFIG,
    }),
  ],
  ...WINSTON_LOGGER_CONFIG,
})

logger.stream = {
  write: function (data) {
    accessLogger.info(data)
  }
}

const Logger = {
  initRequestLogger: function (app) {
    app.use(
      // morgan('myformat', {
      morgan('jsonFormat', {
        stream: logger.stream,
        skip: (req, res) => {
          if (req.url == '/healthcheck' || req.url == '/healthcheck/') {
            return true
          } else {
            return false
          }
        }
      })
    )
  },

  debug: function () {
    if (process.env['NODE_ENV'] === 'development') {
      let cellSite = stackTrace.get()[1];
      logger.debug.apply(
        logger, [
          ...arguments,
          {
            FilePath: cellSite.getFileName(),
            LineNumber: cellSite.getLineNumber(),
          }
        ]
      );
    }
  },

  info: function () {
    let cellSite = stackTrace.get()[1];
    logger.info.apply(
      logger, [
        ...arguments,
        {
          FilePath: cellSite.getFileName(),
          LineNumber: cellSite.getLineNumber(),
        }
      ]
    )
  },

  warn: function () {
    let cellSite = stackTrace.get()[1];
    logger.warn.apply(
      logger, [
        ...arguments,
        {
          FilePath: cellSite.getFileName(),
          LineNumber: cellSite.getLineNumber(),
        }
      ]
    )
  },

  error: function () {
    let cellSite = stackTrace.get()[1];
    logger.error.apply(
      logger, [
        ...arguments,
        {
          filePath: cellSite.getFileName(),
          lineNumber: cellSite.getLineNumber(),
        }
      ]
    )
  },
}

module.exports = Logger