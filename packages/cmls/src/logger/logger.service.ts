import chalk from 'chalk'
import {injectable} from 'inversify'
import 'reflect-metadata'

@injectable()
export class LoggerService {
    static print(text: string, color: string = 'white', prefix?: string, ) {
        console.log(`${prefix} ${chalk[color](text)}`)
    }
}