
export class HttpError extends Error {

	status: number = 500;

}

export class NotFoundError extends HttpError {

	status: number = 404;

}

export class BadRequestError extends HttpError {

	status: number = 400;

}

export class AuthError extends HttpError {

	status: number = 401;

}

