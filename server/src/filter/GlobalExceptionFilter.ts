import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
} from "@nestjs/common";
import { ValidationError } from "class-validator";
import { Response } from "express";
import { FailureException } from "../exception/FailureException";
import { SuccessException } from "../exception/SuccessException";
import { ApiResponse } from "../response/ApiResponse";

@Catch(Error)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.log(exception.name);

    if (exception instanceof SuccessException) {
      response.status(200).json(new ApiResponse(true, exception.message, exception.result));
    } else if (exception instanceof FailureException) {
      response.status(200).json(new ApiResponse(false, exception.message, exception.result));
    } else if (exception instanceof BadRequestException) {
      let errors: ValidationError[] = exception.getResponse()["message"];

      console.log(errors);
      let message = "";

      // check if errors is an array
      if (!Array.isArray(errors)) {
        errors = [errors];
      }

      message = errors.join(", ");

      response.status(400).json(new ApiResponse(false, message, null));
    } else if (exception instanceof ForbiddenException) {
      response.status(403).json(new ApiResponse(false, exception.message, null));
    } else {
      process.env.NODE_ENV === "production"
        ? response.status(500).json(new ApiResponse(false, "Internal Server Error", null))
        : response.status(500).json(new ApiResponse(false, exception.message, null));
    }
  }
}
