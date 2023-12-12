const { json } = require("express");
const product = require("../../../model/productModel")
const StatusEnum = product.schema.path("productStatus").enumValues
const lowerCaseStatusEnum = StatusEnum.map(s=>s.toLowerCase());

exports.createProduct= async(req,res)=>{

    const {proudctName,productDescription, productStockQty, productPrice, productStatus} = req.body
            if(!proudctName || !productDescription ||  !productStockQty || !productPrice || !productStatus)
            {
                        return res.status(400).json({
        message:"Please provide productName, productDescription, productStockQty, productPrice,productStatus"
                        });
            }
            
                    //validate productStatus
                 const valProductStatus= lowerCaseStatusEnum.includes(productStatus.toLowerCase())
                if(!valProductStatus)
                {
                    return res.status(400).json({message:`Invalid productStatus. Accepting  values: ${lowerCaseStatusEnum}`})
                }


                // validate productPrice,productStockQty

                if (typeof productPrice !== 'number' || typeof productStockQty !== 'number') {
                    let errorMessage = '';

                    if (typeof productPrice !== 'number') {
                      errorMessage += 'productPrice must be a number. ';
                    }
                  
                    if (typeof productStockQty !== 'number') {
                      errorMessage += 'productStockQty must be a number. ';
                    }
                  
                    return res.status(400).json({
                      message: errorMessage.trim(), // trim to remove leading/trailing whitespace
                    });
                  }
                  

                    await product.create({
                        proudctName,
                        productDescription,
                        productStockQty,
                        productPrice,
                        productStatus
                    })

    console.log("Product Created Successfully")
    return  res.status(200).json({message:"Product Created Successfully"})
}