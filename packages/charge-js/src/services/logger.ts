import {createLogger, transports, format, config} from 'winston'

let alignColorsAndLogs = format.combine(
  format.colorize({
    all: true
  }),
  format.label({
    label: '[LOGGER]'
  }),
  format.printf(
    info => `${info.label} ${info.level} : ${info.message}`
  )
)

export class Logger {
  silent: boolean = false
  constructor(silent) {
    this.silent = silent
    return logger(this.silent)
  }
}

const logger = (silent) => createLogger({
  transports: [
    new transports.Console({format: alignColorsAndLogs, handleExceptions: true, silent }
      )
  ]
})
