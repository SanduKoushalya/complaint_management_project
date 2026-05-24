const { createLogger, format, transports } = require('winston');

const isProduction = process.env.NODE_ENV === 'production';

const logTransports = [new transports.Console()];

if (!isProduction) {
  const path = require('path');
  const fs   = require('fs');
  const logsDir = path.join(__dirname, '../../logs');
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
  logTransports.push(
    new transports.File({ filename: path.join(logsDir, 'error.log'), level: 'error' })
  );
  logTransports.push(
    new transports.File({ filename: path.join(logsDir, 'combined.log') })
  );
}

const logger = createLogger({
  level: isProduction ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) =>
      `${timestamp} [${level.toUpperCase()}] ${message}`
    )
  ),
  transports: logTransports,
});

module.exports = logger;