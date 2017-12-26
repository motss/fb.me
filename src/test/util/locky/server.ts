// @ts-check

/** Import project dependencies */
import express from 'express';

/** Import other modules */
import me from './me';

export async function locky(): Promise<express.Application> {
  try {
    const app = express();

    app.enable('trust proxy');
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.get('/healthcheck', async (_, res, next) => {
      try {
        res.send(200).send({
          status: 'OK',
          message: 'OK',
          version: '0.1.0',
          server: 'locky',
          timestamp: +new Date(),
        });

        if (global.gc) {
          global.gc();
        }

        return;
      } catch (e) {
        return next(e);
      }
    });
    app.use('/me', me());

    app.use((err, req, res, next) => {
      if (err instanceof Error) {
        console.warn(`[LOCKY][FATALERR] From ${req.originalUrl}`, err);

        return res.status(500).send({
          status: 'Fatal',
          message: err.message || 'Fatal error',
        });
      }

      return next(err);
    });

    return app;
  } catch (e) {
    throw e;
  }
}

export default locky;
