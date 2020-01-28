import * as winston from 'winston'

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            handleExceptions: true
        }),
    ]
})

const fileLogger = winston.createLogger({
    transports: [
        new winston.transports.File({
            dirname: __dirname,
            filename: 'logs.log',
            handleExceptions: true
        })
    ]
})

const dataLogger = winston.createLogger({
    transports: [
        new winston.transports.File({
            dirname: __dirname,
            filename: 'dataStore.json',
        })
    ]
})

export {logger, fileLogger, dataLogger}
