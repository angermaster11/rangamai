import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Request, Response } from "express";
import type { ApiResponse } from "@rangamai/shared";

/**
 * Turns any thrown error into the uniform `{ success:false, error, fieldErrors? }`
 * envelope. class-validator failures arrive as a BadRequest whose `message` is a
 * string[]; we fold those into `fieldErrors` so the admin/web forms can show
 * per-field messages. Unexpected errors log server-side but never leak internals.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger("HttpException");

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = "Internal server error";
    let fieldErrors: Record<string, string[]> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === "string") {
        error = res;
      } else if (res && typeof res === "object") {
        const body = res as { message?: unknown; error?: unknown };
        if (Array.isArray(body.message)) {
          error = "Validation failed";
          fieldErrors = foldValidationMessages(body.message as string[]);
        } else if (typeof body.message === "string") {
          error = body.message;
        } else if (typeof body.error === "string") {
          error = body.error;
        }
      }
    } else if (exception instanceof Error) {
      // Unexpected — log the real error, return a generic message.
      this.logger.error(exception.message, exception.stack);
    }

    if (status >= 500) {
      this.logger.error(`${request.method} ${request.url} -> ${status}: ${error}`);
    }

    const payload: ApiResponse<never> = { success: false, error };
    if (fieldErrors) payload.fieldErrors = fieldErrors;
    response.status(status).json(payload);
  }
}

/**
 * class-validator emits flat strings like "email must be an email".
 * Group them by the leading field token so forms can render inline errors.
 */
function foldValidationMessages(messages: string[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const msg of messages) {
    const field = msg.split(" ")[0] || "_";
    (out[field] ??= []).push(msg);
  }
  return out;
}
