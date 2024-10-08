const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');

//Create Order - /api/v1/order
exports.createOrder = (req,res,next) => {
    const cartItems = req.body;
    const amount = Number(cartItems.reduce((acc, item) => (acc + item.product.price * item.qty), 0 )).toFixed(2);
    const status = 'pending';
    const order = orderModel.create({cartItems,amount,status})

    //Updating Product Stock
    cartItems.forEach(async (item) => {
        const product = await productModel.findById(item.product._id);
        product.stock -= item.qty;
        await product.save();
    });

    res.json(
        {
            success: true,
            order
        }
    )
}