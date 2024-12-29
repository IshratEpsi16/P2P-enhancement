const express = require("express");
const router = express.Router();
let { getPool, getGeneral } = require("../../../../connections/api/v1/connection");

router.use('/profile', require('./profile_update_submit'));


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