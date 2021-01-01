const Customer = require('../model/Customer');
const Session = require('../model/Session');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const atob = require("atob");

module.exports.check_customer = async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    throw new Error('Not found');
  }

  return next();
};

module.exports.create_customer = async (req, res) => {
  
            const customer = new Customer({
                name: req.body.name,
                age: req.body.age,
                address: req.body.address,
                email: req.body.email,
                password: req.body.password,
                status: "Active"
                
            });

            const password = customer.password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds)
            customer.password = hashedPassword

            await customer.save();

            res.json(customer);
    

};

module.exports.get_all_customers = async (req, res) => {
  const customers = await Customer.find();

  res.json(customers);
};

module.exports.delete_customer = async (req, res) => {
    const deleteCustomer = await Customer.findOneAndUpdate({_id: req.params.id},
      { 
          $set: {
                  status: "Inactive"
          }
      }, { useFindAndModify: false }
    );
    res.json(deleteCustomer);
};

module.exports.update_customer = async (req, res) => {
  const customer = await Customer.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, useFindAndModify: false
  });

  res.json(customer);
};

module.exports.get_customer_by_id = async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  res.json(customer);
};

// --------------------------------- AUTH --------------------------------------------

//set time expired for access token
Date.prototype.addHours= function(h){
  this.setHours(this.getHours()+h);
  return this;
}

// add date
Date.prototype.addDays= function(h){
  this.setDate(this.getDate()+h);
  return this;
}


module.exports.login = async (req, res) => {
  const customer = await Customer.findOne({email: req.body.email});
  if (customer){
        const match = await bcrypt.compare(req.body.password, customer.password);
        if(match){

            const token = "null";

            const refreshToken = await jwt.sign({
                 email: customer.email,
                 customerId: customer._id
            }, 
            process.env.REFRESH_TOKEN_SECRET, 
            {
                expiresIn: "1d"
            });


            const session = new Session({
                access_token: token,
                refresh_token: refreshToken,
                expired_date: new Date().addHours(1),
                refresh_token_expired: new Date().addDays(1),
                created_on: Date.now(),
                status: "1"
            });

            const savedSession = await session.save()
            return res.status(200).json({ refresh_token: refreshToken });
        }
        else{
            return res.status(401).json({
                message: "Auth Failed"
            });
        }
  }
  else{
        res.status(400).json({
            message: "Mail not Exist"
        });
  }

          
};



module.exports.logout = async (req, res) => {
  const { refresh_token } = req.body;
  const session_token = await Session.findOneAndDelete({ refresh_token: refresh_token });
  if(session_token)
  {
      return res.status(200).json({ success: "User logged out!" });
  }
  else
  {
      return res.status(400).json({ success: "token not valid!" });
  }
};


module.exports.generatenewtoken = async (req, res) => {
    //get refreshToken
    const { refresh_token } = req.body;
    //send error if no refreshToken is sent
    if (!refresh_token) {
      return res.status(403).json({ error: "Access denied,token missing!" });
    } else {
      //query for the token to check if it is valid:
      const tokenDoc = await Session.findOne({ refresh_token: refresh_token });
      const token_id = tokenDoc.id;
      //console.log(tokenDoc.id)
      //send error if no token found:
      if (!tokenDoc) {
        return res.status(401).json({ error: "Token expired!" });
      } else {
        //extract payload from refresh token and generate a new access token and send it
        const payload = jwt.verify(tokenDoc.refresh_token,  process.env.REFRESH_TOKEN_SECRET);
        const accessToken = jwt.sign({ user: payload },  process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "1h",
        });

        const updated_accesstoken = await Session.updateOne({_id: token_id},
            { 
                 $set: {
                        access_token: accessToken,
                        expired_date: new Date().addHours(1)
                } 
            }
        );

        return res.status(200).json({ accessToken });
      }
    }
  };


  
module.exports.checkToken = async (req, res) => {
    res.status(200).json(
        {
            data: req.userData.user ,
            message: "Auth Success, Token not expired"
        }
    );
  };


module.exports.checkLogin = async (req,res,next) => {

        if (!req.headers.authorization) {
            return res.status(401).send({ error: 'TokenMissing' });
        }
        else{
            const token = req.headers.authorization.split(" ")[1];
            console.log(token);
            //console.log("auth2")
            const decoded = jwt.verify(token, 'accesstokensecret');
            req.userData = decoded;
            res.json(req.userData)
        }
    
};
