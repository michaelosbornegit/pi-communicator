import express, {
  Response as ExResponse,
  Request as ExRequest,
  NextFunction,
} from "express";
import cors from 'cors';
import { ValidateError } from "tsoa";
import { createServer } from "http";
import { RegisterRoutes } from "./oapi/routes";
import env from "./environment";
import { ApiError } from "./ApiError";

const app = express();
const server = createServer(app);

const allowedHosts = [env.APP_HOST, env.API_HOST];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedHosts.indexOf(origin) !== -1 || origin.includes('localhost')) {
        cb(null, true);
      } else {
        cb(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
  })
);

app.get("/", (req, res) => {
  res.send("Go away!");
});

RegisterRoutes(app);

app.use(function errorHandler(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  if (err instanceof ApiError) {
    console.log(err.stack);
    return res.status(err.statusCode).json({
      message: err.name,
    });
  }
  if (err instanceof Error) {
    console.log(err.stack);
    return res.status(500).json({
      message: err.message,
    });
  }

  next();
});

export default server;
