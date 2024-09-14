const {constants} = require('../constants')


const errorHandler = (err, req, res, next) =>{
const statusCode = res.statusCode ? res.statusCode : 500;
switch(statusCode){
    case constants.VALIDATION_ERROR:
        res.json({title: "Validation Failed", message: err.message, stackTrace:err.stack})
s
case constants.NOT_FOUND:
    res.json({title: "NOt Found", message: err.message, stackTrace:err.stack})
    
    case constants.UNAUTHORIZED:
    res.json({title: "Un authorized", message: err.message, stackTrace:err.stack})
    
    case constants.FORBIDDEN:
    res.json({title: "NOt Found", message: err.message, stackTrace:err.stack})
    
    case constants.SERVER_ERROR:
    res.json({title: "Server Error", message: err.message, stackTrace:err.stack})
    
    default:
console.log('no error All Good')
    break;
}


}

module.exports = errorHandler;