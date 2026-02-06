// Custom Error Classes
class CustomAPIError extends Error{
    constructor(message){
        super(message)
    }
}

class BadRequestError extends CustomAPIError{
    constructor(message){
        super(message);
        this.statusCode = 400;
        this.name = 'BadRequestError'
    }
}

class NotFoundError extends CustomAPIError{
    constructor(message){
        super(message);
        this.statusCode = 404;
        this.name = 'NotFounddError'
    }
}

class ValidationError extends CustomAPIError{
    constructor(message){
        
    }
}