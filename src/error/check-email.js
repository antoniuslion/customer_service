const Customer = require('../model/Customer');


module.exports =  async (req,res,next) => {
        try {
            const customers = await Customer.find({email: req.body.email});
            if (customers.length < 1){
               next()
            } 
            else{
                res.status(400).json({
                    message: "Mail Exist"
                });
            }
            
        } catch (err) {
            res.status(400).json({
                message: "Error check mail"
            });
        }
    };
