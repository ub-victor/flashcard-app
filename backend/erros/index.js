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

