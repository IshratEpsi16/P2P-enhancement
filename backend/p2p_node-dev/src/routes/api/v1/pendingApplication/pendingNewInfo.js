const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const profilePendingModel = require("./../../../../models/api/v1/pendingApplication/pendingNewInfo");
const bankList = require("./../../../../models/api/v1/common/bankList");
const {
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const isEmpty = require("is-empty");
const imageFilePathFinder = require("./../../../../common/api/v1/imageFilePathFinder");
const currencyList = require("./../../../../models/api/v1/common/currencyList");
const countryModel = require("./../../../../models/api/v1/common/countryList");
const loginModel = require("./../../../../models/api/v1/authentication/login");



let supplier_check_file_path = `${process.env.backend_url}${process.env.supplier_check_file_path_name}`;
let nid_or_passport_file_path = `${process.env.backend_url}${process.env.nid_or_passport_file_path_name}`;
let supplier_signature_file_path = `${process.env.backend_url}${process.env.supplier_signature_file_path_name}`;
let etin_file_path = `${process.env.backend_url}${process.env.etin_file_path_name}`;

router.post(
  `/profile-new-info-list`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    let filepath1 = `${process.env.backend_url}${process.env.profile_pic1_file_path_name}`;
    let filepath2 = `${process.env.backend_url}${process.env.profile_pic2_file_path_name}`;
    let reqData = {
      APPROVAL_STATUS: req.body.APPROVAL_STATUS,
      SEARCH_VALUE: req.body.SEARCH_VALUE,
    };
    userId = req.user ? req.user.USER_ID : null;
    console.log(reqData);
    try {
      let value = {
        message: `Supplier List`,
        status: 200,
        total: 0,
        profile_pic1: filepath1,
        profile_pic2: filepath2,
        data: [],
      };

      console.log(userId);

      let initiatorResultTotal =
        await profilePendingModel.pendingProfileNewInfoAddTotalInitiator(
          userId,
          reqData.APPROVAL_STATUS,
          reqData.SEARCH_VALUE
        );

      let initiatorResult =
        await profilePendingModel.pendingProfileNewInfoAddInitiator(
          userId,
          reqData.APPROVAL_STATUS,
          reqData.SEARCH_VALUE
        );

      await commonObject.makeArrayObject(initiatorResult);

      if (initiatorResult.queryResult.finalData.length > 0) {
        await commonObject.makeArrayObject(initiatorResultTotal);
        let rowObject = await commonObject.convertArrayToObject(
          initiatorResultTotal.queryResult.finalData
        );
        value.total = rowObject.TOTAL;
        value.data = initiatorResult.queryResult.finalData;
        for (let i = 0; i < value.data.length; i++) {
          let result = await loginModel.initiatorStatus(
            value.data[i].INITIATOR_ID,
            value.data[i].SUPPLIER_ID,
            "PUN",
            value.data[i].PROFILE_NEW_INFO_UID
          );
         
          await commonObject.makeArrayObject(result);
          console.log('Init: ',result.queryResult.finalData[0]);
          value.data[i].INITIATOR_STATUS = result.queryResult.finalData[0];
        }
        return res.status(200).json(value);
      }

      // Total Count
      let supplierListQueryResultTotal =
        await profilePendingModel.pendingProfileNewInfoAddTotal(
          userId,
          reqData.APPROVAL_STATUS,
          reqData.SEARCH_VALUE
        );
      //console.log(supplierListQueryResultTotal);
      await commonObject.makeArrayObject(supplierListQueryResultTotal);
      let rowObject = await commonObject.convertArrayToObject(
        supplierListQueryResultTotal.queryResult.finalData
      );
      value.total = rowObject.TOTAL;
      //List
      let supplierListQueryResult =
        await profilePendingModel.pendingProfileNewInfoAdd(
          userId,
          reqData.APPROVAL_STATUS,
          reqData.SEARCH_VALUE
        );
      await commonObject.makeArrayObject(supplierListQueryResult);

      value.data = supplierListQueryResult.queryResult.finalData;
      for (let i = 0; i < value.data.length; i++) {
        let result = await loginModel.initiatorStatus(
          value.data[i].INITIATOR_ID,
          value.data[i].SUPPLIER_ID,
          "PUN",
          value.data[i].PROFILE_NEW_INFO_UID
        );
        await commonObject.makeArrayObject(result);
        value.data[i].INITIATOR_STATUS = result.queryResult.finalData[0];
      }
      return res.status(200).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.post(
  `/details`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    let reqData = {
      SUPPLIER_ID: req.body.SUPPLIER_ID,
      APPROVER_STATUS: req.body.APPROVER_STATUS,
    };
    //userId = req.user ? req.user.USER_ID : null;

    try {
      let value = {
        message: `New Information Details`,
        status: 200,
        bank_cheque: supplier_check_file_path,
        nid_passport: nid_or_passport_file_path,
        signature_file: supplier_signature_file_path,
        etin_file: etin_file_path,
        data: [],
      };
      if (isEmpty(reqData.SUPPLIER_ID)) {
        let value = {
          message: `Enter Supplier ID`,
          status: 400,
        };
        return res.status(400).json(value);
      }
      if (isEmpty(reqData.APPROVER_STATUS)) {
        let value = {
          message: `Give Approval Status`,
          status: 400,
        };
        return res.status(400).json(value);
      } else {
        let supplierListQueryResult =
          await profilePendingModel.pendingProfileNewInfoAddDetails(
            reqData.SUPPLIER_ID,
            reqData.APPROVER_STATUS
          );
        //console.log(supplierListQueryResult);

        await commonObject.makeArrayObject(supplierListQueryResult);
        //console.log(supplierListQueryResult.queryResult.finalData);
        value.data = supplierListQueryResult.queryResult.finalData;

        if (supplierListQueryResult.queryResult.finalData.length > 0) {
          for (
            let i = 0;
            i < supplierListQueryResult.queryResult.finalData.length;
            i++
          ) {
            let detailsQuery = await profilePendingModel.tableDetails(
              supplierListQueryResult.queryResult.finalData[i].ACTION_TAKEN_BY,
              supplierListQueryResult.queryResult.finalData[i].TABLE_NAME,
              supplierListQueryResult.queryResult.finalData[i].PK_COLUMN_VALUE,
              supplierListQueryResult.queryResult.finalData[i].APPROVER_STATUS
            );
            //console.log(detailsQuery);
            await commonObject.makeArrayObject(detailsQuery);
            let rowObject2 = await commonObject.convertArrayToObject(
              detailsQuery.queryResult.finalData
            );
            //console.log(rowObject2);
            //! For Currency In XXP2P_SUPPLIER_BANK
            if (
              supplierListQueryResult.queryResult.finalData[i].TABLE_NAME ==
              "XXP2P_SUPPLIER_BANK"
            ) {
              //console.log("TABLE_NAME",supplierListQueryResult.queryResult.finalData[i].TABLE_NAME);

              for (
                let j = 0;
                j < detailsQuery.queryResult.finalData.length;
                j++
              ) {
                //console.log(detailsQuery.queryResult.finalData[j]);
                //! Currency Details
                //console.log(detailsQuery.queryResult.finalData[j]);

                let cCode = detailsQuery.queryResult.finalData[j].CURRENCY_CODE;
                //console.log("CURRENCY_CODE",cCode);
                // Currency List
                let queryResult = await currencyList.currencyNameById(
                  detailsQuery.queryResult.finalData[j].CURRENCY_CODE
                );
                await commonObject.makeArrayObject(queryResult);
                let rowObjectCurrency = await commonObject.convertArrayToObject(
                  queryResult.queryResult.finalData
                );
                // Adding CURRENCY_NAME to the corresponding detail row
                detailsQuery.queryResult.finalData[j].CURRENCY_NAME =
                  rowObjectCurrency.CURRENCY_NAME;
                rowObject2 = {
                  ...detailsQuery.queryResult.finalData[j],
                };
              }
            }
            //! For Country In XXP2P_SUPPLIER_SITE
            if (
              supplierListQueryResult.queryResult.finalData[i].TABLE_NAME ==
              "XXP2P_SUPPLIER_SITE"
            ) {
              for (
                let k = 0;
                k < detailsQuery.queryResult.finalData.length;
                k++
              ) {
                //console.log(detailsQuery.queryResult.finalData);
                //! Country Details
                let queryResult = await countryModel.countryNameByValue(
                  detailsQuery.queryResult.finalData[k].COUNTRY
                );
                console.log(queryResult);
                await commonObject.makeArrayObject(queryResult);
                let rowObjectCurrency = await commonObject.convertArrayToObject(
                  queryResult.queryResult.finalData
                );
                // Adding CURRENCY_NAME to the corresponding detail row
                detailsQuery.queryResult.finalData[k].COUNTRY_NAME =
                  rowObjectCurrency.LABEL;
                rowObject2 = {
                  ...detailsQuery.queryResult.finalData[k],
                };
              }
            }
            //console.log(rowObject2);
            supplierListQueryResult.queryResult.finalData[i].TABLE_DATA =
              rowObject2;
          }
        }

        return res.status(200).json(value);
      }
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

module.exports = router;
