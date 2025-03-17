/**
 * Enum for HTTP status codes.
 * 
 * @enum {number}
 */
export const HttpStatus = {
    OK: 200,                  // Successful request
    CREATED: 201,             // Resource successfully created
    ACCEPTED: 202,            // Request accepted, but not yet processed
    NO_CONTENT: 204,          // Request succeeded, but no content to return
    MOVED_PERMANENTLY: 301,   // Resource moved permanently to another URL
    FOUND: 302,               // Resource found at a different URL temporarily
    NOT_MODIFIED: 304,        // Resource not modified since the last request
    BAD_REQUEST: 400,         // Invalid request, bad syntax
    UNAUTHORIZED: 401,        // Authentication required, invalid credentials
    FORBIDDEN: 403,           // Authentication succeeded, but access is forbidden
    NOT_FOUND: 404,           // Resource not found
    METHOD_NOT_ALLOWED: 405,  // HTTP method not allowed for the resource
    CONFLICT: 409,            // Conflict with the current state of the resource
    UNPROCESSABLE_ENTITY: 422, // Request entity is correct, but unable to process instructions
    INTERNAL_SERVER_ERROR: 500,  // Internal server error
    NOT_IMPLEMENTED: 501,     // Server doesn't support the requested feature
    BAD_GATEWAY: 502,         // Invalid response from upstream server
    SERVICE_UNAVAILABLE: 503, // Service temporarily unavailable
    GATEWAY_TIMEOUT: 504      // Server timed out waiting for a response from upstream server
};
  