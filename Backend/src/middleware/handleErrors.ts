
import type { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/errors.js";
import { logger } from "../utils/logger.js";

export function handleErrors(err: Error, req: Request, res: Response, next: NextFunction) {

	let message = err.message;
	let status;

	if (err instanceof HttpError) {

		status = err.status

	} else {

		status = 500;
		message = "Something went wrong"
		logger.error({ err }, "Request handling failed");

	}

	res.status(status).json({
		error: message
	});

}
