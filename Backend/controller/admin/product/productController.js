const Product= require("../../../model/productModel")

exports.createProduct= (req,res)=>{

    const {proudctName,productDescription, productStockQty, productPrice, productStatus} = req.body
    if(!proudctName || !productDescription ||  !productStockQty || !productPrice !! !productStatus)
    {

    }
    await Product.create({
        proudctName,
        productDescription,
        productStockQty,
        productPrice,
        productStatus
    })

    console.log("Product Created Successfully")
}