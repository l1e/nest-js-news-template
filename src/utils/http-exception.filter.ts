import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
} from "@nestjs/common";
import { Response } from "express";

// Output formater if we response error.
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception.getStatus();

		let statusText = exception.getResponse();

		let statusTextFormatted: string | string[];

		if (typeof statusText === "object") {
			let toArray = Object.values(statusText);

			if (
				toArray[0] === "Unauthorized" ||
				toArray[0] === "Forbidden resource" ||
				toArray[1] === "Unexpected field" ||
				toArray[0] === "Cannot GET /favicon.ico" ||
				toArray[2] === "Not Found" ||
				toArray[2] === "Bad Request"
			) {
				statusTextFormatted = toArray[0];
			} else if (toArray[2] === "Payload Too Large") {
				statusTextFormatted = "Max file size is 1mb";
			} else if (toArray[0].includes("Cannot GET")) {
				statusTextFormatted = toArray[0];
			} else {
				statusTextFormatted = toArray[0];
			}
		} else {
			statusTextFormatted = statusText;
		}
		response.status(status).json({
			success: false,
			status_code: status,
			errors: {
				error_code: status,
				error_message: statusTextFormatted.toString(),
			},
		});
	}
}
