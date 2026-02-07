// Async wrapper to eliminate try/catch in controllers

const asyncWrapper = (fn)=> {
    return async (req, res, next)=>{
        try{

        }catch(error){
            next(error)
        }
    }
}