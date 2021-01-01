const express = require('express');
const catchErrors = require('express-catch-errors');
const checkEmail = require("../error/check-email");
const checkAuth = require("../error/check-auth");

const router = express.Router();
const {
  check_customer,
  create_customer,
  get_all_customers,
  delete_customer,
  update_customer,
  get_customer_by_id,
  login,
  logout,
  generatenewtoken,
  checkToken,
  checkLogin
} = require('../controller/customer_controller.js');

router
  .route('/')
  .get(catchErrors(get_all_customers))
  .post(checkEmail, catchErrors(create_customer));

router
  .route('/:id')
  .get(catchErrors(check_customer), catchErrors(get_customer_by_id))
  .patch(catchErrors(check_customer), catchErrors(update_customer))

router
  .route('/deleted/:id')
  .patch(catchErrors(check_customer), catchErrors(delete_customer))

router
  .route('/auth/login')
  .post(catchErrors(login))

router
  .route('/auth/logout')
  .post(catchErrors(logout))

router
  .route('/auth/generate')
  .post(catchErrors(generatenewtoken))

router
  .route('/auth/checkToken')
  .get(catchErrors(checkAuth),catchErrors(checkToken))

router
  .route('/auth/checkLogin')
  .get(catchErrors(checkLogin))

module.exports = router;