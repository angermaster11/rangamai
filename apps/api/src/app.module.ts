import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import configuration, { AppConfig } from "./config/configuration";
import { AppController } from "./app.controller";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { ServicesModule } from "./services/services.module";
import { ProjectsModule } from "./projects/projects.module";
import { ClientsModule } from "./clients/clients.module";
import { LeadsModule } from "./leads/leads.module";
import { MediaModule } from "./media/media.module";
import { SettingsModule } from "./settings/settings.module";
import { HomepageModule } from "./homepage/homepage.module";
import { StatsModule } from "./stats/stats.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      // Per-app secrets live in apps/api/.env.local (gitignored).
      envFilePath: [".env.local", ".env"],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig, true>) => ({
        uri: config.get("mongodbUri", { infer: true }),
      }),
    }),
    // Global baseline rate limit: 60 requests / minute / IP.
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    UsersModule,
    AuthModule,
    ServicesModule,
    ProjectsModule,
    ClientsModule,
    LeadsModule,
    MediaModule,
    SettingsModule,
    HomepageModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [
    // Apply the throttler to every route by default.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
