const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../../common/api/v1/common");
const prFromEBSModel = require("../../../../../models/api/v1/pr2po/pr/prFromEBS");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../../middleware/authorization");
const rfqModel = require("../../../../../models/api/v1/pr2po/pr/rfqPreparation");
const isEmpty = require("is-empty");

router.post(`/list`, verifyToken, userRoleAuthorization, async (req, res) => {
  try {
    let value = {
      message: `Approved PR List`,
      status: 200,
      total: 0,
      data: [],
    };
    //userId = req.user ? req.user.USER_ID : null;
    let reqData = {
      BUYER_ID: req.body.BUYER_ID,
      ORG_ID: req.body.ORG_ID,
      PR_NUMBER: req.body.PR_NUMBER,
      ITEM_NAME: req.body.ITEM_NAME,
      DATE_FROM: req.body.DATE_FROM,
      DATE_TO: req.body.DATE_TO,
      REQUESTOR_NAME: req.body.REQUESTOR_NAME,
      BUYER_NAME: req.body.BUYER_NAME,
      OFFSET: req.body.OFFSET,
      LIMIT: req.body.LIMIT,
    };
    // Total Count
    let queryResultTotal = await prFromEBSModel.prFromEBSTotal(
      reqData.BUYER_ID,
      reqData.ORG_ID,
      reqData.PR_NUMBER,
      reqData.ITEM_NAME,
      reqData.DATE_FROM,
      reqData.DATE_TO,
      reqData.REQUESTOR_NAME,
      reqData.BUYER_NAME,
    );
    //console.log(queryResultTotal);
    await commonObject.makeArrayObject(queryResultTotal);
    let rowObject = await commonObject.convertArrayToObject(
      queryResultTotal.queryResult.finalData
    );
    value.total = rowObject.TOTAL;
    //console.log(reqData);
    // List
    let queryResultList = await prFromEBSModel.prFromEBSList(
      reqData.BUYER_ID,
      reqData.ORG_ID,
      reqData.PR_NUMBER,
      reqData.ITEM_NAME,
      reqData.DATE_FROM,
      reqData.DATE_TO,
      reqData.REQUESTOR_NAME,
      reqData.BUYER_NAME,
      reqData.OFFSET,
      reqData.LIMIT
    );
    //console.log(queryResultList);
    await commonObject.makeArrayObject(queryResultList);

    for (let i = 0; i < queryResultList.queryResult.finalData.length; i++) {
      let delivery = {};
      if (
        !isEmpty(
          queryResultList.queryResult.finalData[i].DELIVER_TO_LOCATION_ID
        )
      ) {
        //Delivery Location name
        delivery.DELIVER_TO_LOCATION_ID =
          queryResultList.queryResult.finalData[i].DELIVER_TO_LOCATION_ID;
        let queryResultDeliveryLocation = await prFromEBSModel.locationNameById(
          delivery
        );
        await commonObject.makeArrayObject(queryResultDeliveryLocation);
        let rowObjectDeliveryLocationName =
          await commonObject.convertArrayToObject(
            queryResultDeliveryLocation.queryResult.finalData
          );
        queryResultList.queryResult.finalData[i].DELIVER_TO_LOCATION_NAME =
          rowObjectDeliveryLocationName.LOCATION_CODE;
      }
    }

    value.data = queryResultList.queryResult.finalData;
    return res.status(value.status).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

module.exports = router;
