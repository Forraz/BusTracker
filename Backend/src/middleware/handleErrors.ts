
import type { Request, Response, NextFunction } from "express";

export function handleErrors(err: Error, req: Request, res: Response, next: NextFunction) {

	res.status(500).json({
		error: err.message
	});

}
