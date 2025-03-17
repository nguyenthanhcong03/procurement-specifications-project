/**
 * Represents an HTTP exception with a custom error code.
 * Extends the built-in Error class to include an error code and message.
 * 
 * @class HttpException
 * @extends Error
 * @description This class is used to create custom exceptions with an associated error code and message.
 */
export class HttpException  {
    /**
     * Creates an instance of the HttpException class.
     */
    constructor(errorCode, message) {
        this.errorCode = errorCode;
        this.message = message;
    }
}