const express = require("express");
const router = express.Router();
let { getPool, getGeneral } = require("../../../../connections/api/v1/connection");

router.use('/pending', require('./pendingRegistration'));
router.use('/pending', require('./pendingProfileUpdate'));
router.use('/submission', require('./submission'));
router.use('/registration', require('./approve_reject'));
router.use('/update', require('./newUpdate'));
router.use('/update-profile', require('./approveRejectProfileUpdate'));
router.use('/cs', require('./pendingCS'));
router.use('/pending-new', require('./pendingNewInfo'));
router.use('/new-info-approval', require('./approveRejectProfileNewInfo'));
router.use('/pending-invoice', require('./pendingInvoice'));

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