/**
 * Represents a standard HTTP response.
 * 
 * @class HttpResponse
 * @description This class is used to structure HTTP responses with data and a message.
 */
export class HttpResponse {
    /**
     * Creates an instance of the HttpResponse class.
     * 
     * @param {object|string|Array|null} data - The data to be sent in the response.
     * @param {string|null} message - A message describing the response.
     */
    constructor(data, message) {
        this.data = data;
        this.message = message;
    }
}