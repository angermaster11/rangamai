import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import type { AppConfig } from "./config/configuration";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: false });
  const logger = new Logger("Bootstrap");
  const config = app.get(ConfigService<AppConfig, true>);

  const jwt = config.get("jwt", { infer: true });
  if (!jwt.secret || jwt.secret.length < 16) {
    // Fail fast: an empty/weak JWT secret would silently make auth insecure.
    logger.error(
      "JWT_SECRET is missing or too short. Set a strong value in apps/api/.env.local.",
    );
    process.exit(1);
  }

  // Security headers. API is JSON-only, so CSP defaults are not needed here.
  app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));
  app.use(cookieParser());

  const cors = config.get("cors", { infer: true });
  app.enableCors({
    origin: cors.origins,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  });

  app.setGlobalPrefix("api");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = config.get("port", { infer: true });
  await app.listen(port);
  logger.log(`RANGAMAI API listening on http://localhost:${port}/api`);
}

void bootstrap();
