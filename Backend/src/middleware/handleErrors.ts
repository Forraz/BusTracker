
import type { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../errors/errors.js";

export function handleErrors(err: Error, req: Request, res: Response, next: NextFunction) {

	let message = err.message;
	let status;

	if (err instanceof NotFoundError) {

		status = 404;

	} else {

		status = 500;
		message = "Something went wrong"
		console.error(err);

	}

	res.status(status).json({
		error: message
	});

}
