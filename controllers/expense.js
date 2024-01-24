const Expense = require('../model/expense');
const mongoose = require("mongoose");
const User =require('../model/login');

exports.saveIncome=async (req, res) => {
    try {
        const user=req.user;
        const userincome=req.body.income;
        await user.updateOne({income:userincome});
        res.status(201).json({ success: true, message:"updated"});
    } catch (error) {
        res.status(500).json({ error: 'Error in saving the income' });
    }
};
exports.saveData = async (req, res) => {
    let session;
    try {

        
        session = await mongoose.startSession();
        session.startTransaction();

        const user = req.user;

    // Create the expense with the session
        const data = await Expense.create(
            {
                user: user._id,
                Expenses: req.body.Expenses,
                Description: req.body.Description,
                Category: req.body.Category,
            },
            { session }
        );

		// Update the user's totalExpense field
		await User.updateOne({ _id: req.user._id }, { $inc: { totalexpenses: +req.body.Expenses } }).session(session);
        
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ data });
    } catch (error) {
        await session.abortTransaction();
        console.error(error);
        res.status(500).json({ error: 'Error in saving the data' });
    }
};

exports.deleteData = async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();
        
        const id = req.params.id;

        const oldExpense = await Expense.findOne({ _id: id }, { _id: 0, Expenses: 1 }).exec();
        
        console.log(oldExpense);
		await User.updateOne({ _id: req.user._id }, { $inc: { totalexpenses: -oldExpense.Expenses } }).session(session);
        await Expense.findByIdAndDelete(id, { session });
        console.log("req.user")
        
        await session.commitTransaction();
        session.endSession();
        
        res.status(201).json({ message: 'Deleted successfully' });
    } catch (error) {
        await session.abortTransaction();
        console.error(error);
        res.status(500).json({ error: 'Deletion failed' });
    }
};

exports.getDataFromDb = async (req, res) => {
    try {
        const userLogin=req.user;
        const premium=req.user.premium;
        
        // Find all expenses associated with the current user
		const dbData = await Expense.find({ user: req.user._id });

		// Map the Mongoose documents to plain JavaScript objects
		const data = dbData.map((expense) => expense.toObject());
        
        res.status(201).json({ data: data, premium: premium ,userLogin:userLogin});
    } catch (error) {
        res.status(500).json({ error: 'Error in getting the data' });
    }
};

exports.getPageData = async (req, res) => {
    const currentPage = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.count) || 3;
    const userId = req.user._id;
    
    try {

        const totalExpenses = await Expense.countDocuments({ user: userId });

        const expenses = await Expense.find({ user: userId })
			.skip((currentPage - 1) * perPage)
			.limit(perPage);

        
        const hasNext = currentPage * perPage < totalExpenses;
        const hasPrevious = currentPage > 1;
        const lastPage = Math.ceil(totalExpenses / perPage);
        const nextPage = hasNext ? currentPage + 1 : null;
        const previousPage = hasPrevious ? currentPage - 1 : null;

        const response = {
            pageData: expenses,
            hasPrevious,
            currentPage,
            hasNext,
            totalExpenses,
            lastPage,
            totalPages: lastPage,
            nextPage,
            previousPage,
        };
        res.status(200).json({ success: true, message: "successfully retrieved data", data: response });
    } catch (err) {
        res.status(500).json({ success: false, message: "failed to retrieve data", error: err });
    }
};