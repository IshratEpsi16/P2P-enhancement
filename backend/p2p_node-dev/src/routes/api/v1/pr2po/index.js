const express = require("express");
const router = express.Router();
let { getPool, getGeneral } = require("../../../../connections/api/v1/connection");

router.use('/approved-pr', require('./pr/prFromEBS'));
router.use('/rfq', require('./pr/rfqPreparation'));
router.use('', require('./pr'));
router.use('/supplier-rfq', require('./supplierQuotation'));
router.use('/submitted-quotation', require('./submittedQuotations'));
router.use('/po', require('./po/po'));


router.get('/connection-check', async (req, res) => {
    try {

        // //  pull connect check
        // const connection = await getPool(); 
        // const result = await connection.execute('SELECT 1 FROM DUAL');
        // console.log('Database connection is established:', result.rows);


        // // general connect
        // const connection = await getGeneral();
        // const result = await connection.execute('SELECT 1 FROM DUAL');
        // console.log(result);
        // await connection.close();

        return res.send({
            "message": "Connection create success ",
            "api v": 1,
        });

    } catch (error) {
        return res.status(400)
            .send({
                "status": 404,
                "message": "Connection create fail try",
                "api v": 1,
                "error": error
            });
    }
});


module.exports = router;