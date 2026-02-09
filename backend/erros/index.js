// Custom Error Classes
class CustomAPIError extends Error{ //Error has 3 properties: Name, Message and Stack
    // new CustomAPIError("Wrong input") = message = "Wrong input"

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
        super(message);
        this.statusCode = 400;
        this.name = 'ValideationError'
    }
}

class DuplicateKeyError extends CustomAPIError {
    constructor(message){
        super(message);
        this.statusCode =409;
        this.name = 'DuplicateKeyError'
    }
}

module.exports = {
    CustomAPIError,
    BadRequestError,
    NotFoundError,
    ValidationError,
    DuplicateKeyError
};

/*
HTTP status code.

Code	Meaning
400	    Bad request
404	    Not found
409	    Conflict
*/