const { Op } = require("sequelize");
const { inquiries, bills } = require("../database/connection");

// CREATE BILL
const createBillForConfirmedInquiry = async (req, res) => {
  const { inquiryId } = req.params;

  const inquiry = await inquiries.findByPk(inquiryId);
  if (!inquiry) {
    return res.status(404).json({ message: "Inquiry not found" });
  }

  if (inquiry.status !== "CONFIRMED") {
    return res.status(400).json({
      message: "Cannot create bill. Inquiry is not confirmed.",
    });
  }

  // Prevent duplicate bill
  const existingBill = await bills.findOne({ where: { inquiryId } });
  if (existingBill) {
    return res.status(400).json({
      message: "Bill already exists for this inquiry",
    });
  }

  const lastBill = await bills.findOne({
    order: [["createdAt", "DESC"]],
  });

  const nextBillNo = lastBill
    ? String(parseInt(lastBill.billNo, 10) + 1).padStart(3, "0")
    : "001";

  const bill = await bills.create({
    billNo: nextBillNo,
    inquiryId,
    baseCost: inquiry.baseCost,
    packagingFee: inquiry.packagingFee,
    liquorCost: inquiry.liquorCost,
    finalAmount: inquiry.finalAmount,
  });

  // Update inquiry status to BILL
  await inquiries.update({ status: "BILL" }, { where: { id: inquiryId } });

  return res.status(201).json({
    message: "Bill created successfully",
    data: bill,
  });
};

// FETCH BILLS
const fetchBills = async (req, res) => {
  const { page = 1, limit = 10, search = "", status } = req.query;
  const offset = (page - 1) * limit;

  const billWhere = {};
  const inquiryWhere = {};

  if (search) {
    billWhere.billNo = { [Op.like]: `%${search}%` };
  }

  if (status) {
    inquiryWhere.status = status;
  }

  const { count, rows } = await bills.findAndCountAll({
    where: billWhere,
    include: [
      {
        model: inquiries,
        as: "inquiry",
        where: inquiryWhere,
      },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["createdAt", "DESC"]],
  });

  const totalPages = Math.ceil(count / limit);

  return res.status(200).json({
    message: "Bills fetched successfully",
    data: rows,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalItems: count,
      itemsPerPage: parseInt(limit),
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};

module.exports = {
  createBillForConfirmedInquiry,
  fetchBills,
};
