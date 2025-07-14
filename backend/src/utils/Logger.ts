import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import { fileURLToPath } from "url";
const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)
const logDir = path.join(__dirname,'../../logs')
const errorTransport = new DailyRotateFile({
  filename:'error-%DATE%.log',
  dirname:logDir,
  datePattern:'YYYY-MM-DD',
  level:'error',
  zippedArchive:false,
  maxFiles:'7d'
})

const logger = winston.createLogger({
  level:'error',
  format:winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({stack:true}),
    winston.format.json()
  ),
  transports:[
    errorTransport,
    new winston.transports.Console({format:winston.format.simple()})
  ],
})

export default logger