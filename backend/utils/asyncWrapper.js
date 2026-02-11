// Async wrapper to eliminate try/catch in controllers

const asyncWrapper = (fn)=> {
    // it returns another function because Express expects route handlers in this format
    return async (req, res, next)=>{
        try{
            await fn(req, res, next);
        }catch(error){
            next(error)
        }
    };
};

module.exports = asyncWrapper;