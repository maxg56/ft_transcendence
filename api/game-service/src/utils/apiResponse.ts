// utils/apiResponse.ts

export function apiSuccess<T>(data: T, statusCode = 200) {
	return {
		statusCode,
		body: {
			status: 'success',
			data,
		},
	};
}

export function apiError(message: string, statusCode = 400, errorCode?: string) {
	return {
		statusCode,
		body: {
			status: 'error',
			message,
			...(errorCode && { code: errorCode }),
		},
	};
}
