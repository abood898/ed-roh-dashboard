import mongoose from "mongoose";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Affiliatestat from "../models/Affiliatestat.js";

export const getAdmins = async (req, res) => {
  try {
    const customers = await User.find({ role: "admin" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserPerformance = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("_id");
    const affiliateStats = await Affiliatestat.find({
      userId: id,
    });
    const userWithStats = {
      user,
      affiliateStats,
    };

    const saleTransactions = await Promise.all(
      userWithStats.affiliateStats[0].affiliateSales.map((id) => {
        return Transaction.findById(id);
      })
    );
    const filteredSaleTransactions = saleTransactions.filter(
      (transaction) => transaction !== null
    );

    res
      .status(200)
      .json({ user: userWithStats, sales: filteredSaleTransactions });
    // res.status(200).json({ user: userWithStats });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
