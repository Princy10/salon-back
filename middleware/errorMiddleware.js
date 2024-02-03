const errorMiddleware = (err, req, res, next) => {
    console.error('An error occurred:', err.message);

    let statusCode = res.statusCode ? res.statusCode : 500;
    let errorMessage = 'Internal Server Error';

    if (err.name === 'ValidationError') {
        statusCode = 400;
        errorMessage = 'Validation Error';
    } else if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        errorMessage = 'Unauthorized Access';
    } else if (err.name === 'NotFoundError') {
        statusCode = 404;
        errorMessage = 'Not Found';
    } else if (err.name === 'SyntaxError' && err instanceof SyntaxError) {
        statusCode = 400;
        errorMessage = 'Syntax Error in JSON request';
    } else if (err.code === 'ECONNREFUSED') {
        statusCode = 503;
        errorMessage = 'Service Unavailable';
    }

    res.status(statusCode);
    res.json({ message: errorMessage, stack: process.env.NODE_ENV === "development" ? err.stack : null });
};

module.exports = errorMiddleware;