import {createLogger, transports, format} from 'winston';


const logger = createLogger({
    transports: [
        new transports.Console(),
        new transports.File({filename:'error.log', level:'error'}),
        new transports.File({filename:'combined.log'}),
    ],
    format: format.combine(format.timestamp(), format.simple()),

});

export default logger;