import winston from 'winston';
import dailyRotate from 'winston-daily-rotate-file';
import environment from './environment';
import environmentConstants from './environment.constants';

const logger = winston.createLogger({
  format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })),
  defaultMeta: { service: environment.serviceName },
});
if (environment.env === environmentConstants.ENV.DEVELOPMENT) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          info =>
            `${info.timestamp} ${info.level} ${info.message}${info.data ? `\n${JSON.stringify(info.data)}` : ''}\n`,
        ),
      ),
      level: 'silly',
    }),
  );
}

const deviceLogger = logger.child({ name: 'deviceLogger' });
const routerLogger = logger.child({ name: 'routerLogger' });
logger.add(
  new dailyRotate({
    level: 'info',
    dirname: './logs',
    filename: `${environment.serviceName}-service-%DATE%`,
    extension: '.log',
    format: winston.format.combine(winston.format(info => info.level !== 'http' && info)(), winston.format.json()),
    json: true,
    maxFiles: 7,
  }),
);
routerLogger.add(
  new dailyRotate({
    level: 'http',
    dirname: './logs',
    extension: '.log',
    filename: `${environment.serviceName}-access-%DATE%`,
    format: winston.format.combine(winston.format(info => info.level === 'http' && info)(), winston.format.json()),
    json: true,
    maxFiles: 7,
  }),
);

deviceLogger.add(
  new dailyRotate({
    level: 'info',
    dirname: './device-logs',
    filename: `${environment.serviceName}-device-%DATE%`,
    maxFiles: 7,
    extension: '.log',
    format: winston.format.combine(winston.format(info => info.level !== 'http' && info)()),
  }),
);

export default logger;
export const RouterLogger = routerLogger;
export const DeviceLogger = deviceLogger;
