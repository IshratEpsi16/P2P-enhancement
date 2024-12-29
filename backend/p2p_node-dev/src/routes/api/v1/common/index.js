const express = require("express");
const router = express.Router();
let { getPool, getGeneral } = require("../../../../connections/api/v1/connection");

router.use('/common', require('./employee_list'));
router.use('/profile', require('./profile_picture_upload'));
router.use('/supplier', require('./supplier_list'));
router.use('/hierarchy', require('./hierarchyByModule'));
router.use('/common', require('./sendEmail'));
router.use('/common', require('./sendCommonEmail'));
router.use('/common', require('./bankList'));
router.use('/common', require('./countryList'));
router.use('/common', require('./currencyList'));
router.use('/payment-methods', require('./paymentMethodList'));
router.use('/supplier-category', require('./supplierCategory'));
router.use('/approval-stage', require('./approvalStage'));
router.use('/common', require('./ouListAsBG'));
router.use('/approval', require('./approveHistoryByModule'));
router.use('/system-setup', require('./systemSetup/index'));
router.use('/notification', require('./notification/notificationHandler'));
router.use('/common', require('./userPasswordReset'));
router.use('/common', require('./fileRemover'));
router.use('/common', require('./expenseType'));
router.use('/common', require('./supplierSyncFromEBS'));


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