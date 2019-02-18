const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json, printf, errors } = format;

// To rotate on log files every few days
require('winston-daily-rotate-file');

const fs = require('fs');
const path = require('path');

// Ensure application directory logs exist
const appLogDir = path.join(__dirname, 'logs');
if (!fs.existsSync(appLogDir)) { fs.mkdirSync(appLogDir); }

const logger = createLogger({
  level: (process.env.APP_LOG_LEVEL || 'info'),
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    json()
  ),
  transports: [
    new transports.DailyRotateFile({
      filename: path.join(appLogDir, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '3d',
      level: 'info'
    })
  ]
});

const simpleConsoleFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// When not in production log to the console with a simple format
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: simpleConsoleFormat
  }));
}

module.exports = logger;
