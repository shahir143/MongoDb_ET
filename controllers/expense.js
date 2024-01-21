const Expense = require('../model/expense');
const Sequelize= require('../util/database');
exports.saveIncome=async (req, res) => {
    let t;
    try {
        t = await Sequelize.transaction();
        const user=req.user;
        const userincome=req.body.income;
        await user.update({income:userincome},t);
        await t.commit();
        res.status(201).json({ success: true, message:"updated"});
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: 'Error in saving the income' });
    }
};
exports.saveData = async (req, res) => {
    let t;
    try {
        t = await Sequelize.transaction();
        const user=req.user;
        const data = await Expense.create({
            Expenses: req.body.Expenses,
            Description: req.body.Description,
            Category: req.body.Category,
            userId: req.user.id,
        });
        const totalExpenses=await Expense.sum('Expenses',{where:{userId: req.user.id},t});
        await user.update({totalexpenses:totalExpenses},t);

        await t.commit();
        res.status(201).json({ data });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: 'Error in saving the data' });
    }
};

exports.deleteData = async (req, res) => {
    let t;
    try {
        t = await Sequelize.transaction();
        const user = req.user; 
        const id = req.params.id;
        await Expense.destroy({ where: { id: id } });

        const totalExpenses = await Expense.sum('Expenses', { where: { userId: user.id }, t });

        await user.update({ totalexpenses: totalExpenses }, { where: { id: user.id }, t });

        await t.commit();
        res.status(201).json({ message: 'Deleted successfully' });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ error: 'Deletion failed' });
    }
};

exports.getData = async (req, res) => {
    try {
        const userLogin=req.user;
        const premium=req.user.premium
        const dbData = await Expense.findAll({ where: { userId: req.user.id } });
        const data = dbData.map(data => data.dataValues);
        
        res.status(201).json({ data: data, premium: premium ,userLogin:userLogin});
    } catch (error) {
        res.status(500).json({ error: 'Error in getting the data' });
    }
};

exports.getPageData = async (req, res) => {
    console.log(req.query);
    const currentPage = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.count) || 3;
    const userId = req.user.id;
    
    try {
        const totalExpenses = await Expense.count({
            where: { userId: userId }
        });

        const expenses = await Expense.findAll({
            where: { userId: userId },
            limit: perPage,
            offset: (currentPage - 1) * perPage
        });

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
        console.log(response);
        res.status(200).json({ success: true, message: "successfully retrieved data", data: response });
    } catch (err) {
        res.status(500).json({ success: false, message: "failed to retrieve data", error: err });
    }
};