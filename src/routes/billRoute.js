const {
  createBillForConfirmedInquiry,
  fetchBills,
} = require("../controller/billController");

const { isAuthenticated } = require("../middleware/isAuthenticated");
const catchError = require("../util/catchError");

const router = require("express").Router();

// FETCH BILLS 
router
  .route("/bills")
  .get(isAuthenticated, catchError(fetchBills));

//  CREATE BILL FOR CONFIRMED INQUIRY
router
  .route("/bills/:inquiryId")
  .post(isAuthenticated, catchError(createBillForConfirmedInquiry));

module.exports = router;
