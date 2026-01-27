const {Router:ExpressRouter} =require("express")
const {handlePolicies} = require("../middleware/handlePolicies.js")

class Router{
    constructor(){
        this.router = ExpressRouter()
        this.init()
    }

    getRouter(){
        return this.router
    }

    init(){}

    get(path, ...callbacks){
        this.router.get(path, this.generateCustomResponse, ...this.applyCallback(callbacks))
    };

    post(path, ...callbacks){
        this.router.post(path, this.generateCustomResponse, ...this.applyCallback(callbacks))
    };

    put(path, ...callbacks){
        this.router.put(path, this.generateCustomResponse, ...this.applyCallback(callbacks))
    };

    delete(path, ...callbacks){
        this.router.delete(path, this.generateCustomResponse, ...this.applyCallback(callbacks))
    };


    //---------------------Respuestas custom----------------------//
    generateCustomResponse(req, res, next){
        res.sendSuccess = payload =>{
            res.json({status: `succes`, message: payload})
        }
        
        res.sendUserError = error =>{
            res.status(400).json({status: `error`, error})
        }

        res.sendServerError = error => {
            res.status(500).json({status: `error interno`, error})
        }

        next();
    };


    applyCallback(callbacks){
        return callbacks.map(callback => {

            return async (req, res, next) =>{
             try {
                await callback(req, res, next)
            } catch (error) {
                res.status(500).send({error: error.message})
            }   
            };
        });
    };
};

class UserRouter extends Router{
    init(){
        this.get("/", handlePolicies(["PUBLIC"]), (req, res)=>{
            res.sendSuccess("Accediendo a vista publica")
        })

        this.get("/currentUser", handlePolicies(["USER, ADMIN"]), (req, res)=>{
            res.sendSuccess(req.user)
        })

        this.get("/currentAdmin", handlePolicies(["ADMIN"]), (req, res)=>{
            res.sendSuccess(req.user)
        })
    }
};

module.exports={Router, UserRouter }