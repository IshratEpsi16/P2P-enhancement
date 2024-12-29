const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const csModel = require("../../../../models/api/v1/csCreation/csCreation");
const ouModel = require("./../../../../models/api/v1/common/orgNameById");
const supplierListModel = require("../../../../models/api/v1/csCreation/supplierList");
const rfqModel = require("../../../../models/api/v1/pr2po/pr/rfqPreparation");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const isEmpty = require("is-empty");
const templateModel = require("./../../../../models/api/v1/approvalTemplate/templateManage");
const { log } = require("winston");

router.post(
  `/create-update`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let finalData = {};
      let whereData = {};
      let updateData = {};
      let whereLinesData = {};
      let updateLinesData = {};
      let finalItemData = {};
      let value = {
        message: ``,
        status: 200,
      };
      userId = req.user ? req.user.USER_ID : null;
      let reqData = {
        CS_ID: req.body.CS_ID,
        RFQ_ID: req.body.RFQ_ID,
        ORG_ID: req.body.ORG_ID,
        CS_TITLE: req.body.CS_TITLE,
        CS_STATUS: req.body.CS_STATUS,
        GENERAL_TERMS: req.body.GENERAL_TERMS,
        NOTE: req.body.NOTE,
        CURRENCY_CODE: req.body.CURRENCY_CODE,
        FILE_NAME: req.body.FILE_NAME,
        FILE_ORG_NAME: req.body.FILE_ORG_NAME,
        CS_TOTAL_AMOUNT: req.body.CS_TOTAL_AMOUNT,
        BUYER_DEPARTMENT: req.body.BUYER_DEPARTMENT,
        APPROVAL_FLOW_TYPE: req.body.APPROVAL_FLOW_TYPE,
        CONVERSION_RATE: req.body.CONVERSION_RATE,
        ITEMS: req.body.ITEMS,
      };
      //!If new cs is creating
      if (isEmpty(reqData.CS_ID)) {
        if (isEmpty(reqData.RFQ_ID)) {
          return res
            .status(400)
            .send({ message: "Please Give RFQ ID", status: 400 });
        }
        if (isEmpty(reqData.BUYER_DEPARTMENT)) {
          return res
            .status(400)
            .send({ message: "Please Give Buyer Department.", status: 400 });
        }
        if (isEmpty(reqData.APPROVAL_FLOW_TYPE)) {
          return res
            .status(400)
            .send({ message: "Please Give Approval Flow Type.", status: 400 });
        }

        if (!Array.isArray(reqData.ITEMS)) {
          return res
            .status(400)
            .send({ message: "Items Should Be Array.", status: 400 });
        }
        Object.entries(reqData).forEach(([key, value]) => {
          if (!isEmpty(value) && key != "ITEMS") {
            finalData[key] = value;
          }
        });
      }

      let { ITEMS, ...newDta } = finalData;
      finalData = newDta;

      finalData.CREATED_BY = userId;
      console.log(finalData);

      if (!isEmpty(reqData.CS_ID)) {
        Object.entries(reqData).forEach(([key, value]) => {
          if (value && key == "CS_ID") {
            whereData[key] = value;
          }
        });

        Object.entries(reqData).forEach(([key, value]) => {
          if (value && key !== "CS_ID" && value && key !== "ITEMS") {
            updateData[key] = value;
          }
        });
      }
      let templateObject = {};
      if (
        reqData.BUYER_DEPARTMENT.toUpperCase() === "LOCAL" &&
        reqData.APPROVAL_FLOW_TYPE.toUpperCase() === "LONG"
      ) {
        templateObject.APPROVAL_FLOW_TYPE = finalData.APPROVAL_FLOW_TYPE;
        templateObject.BUYER_DEPARTMENT = finalData.BUYER_DEPARTMENT;
        templateObject.AMOUNT = finalData.TOTAL_AMOUNT;
        templateObject.ORG_ID = finalData.ORG_ID;
        templateObject.MODULE_NAME = "Local CS Approval";
      }
      if (
        reqData.BUYER_DEPARTMENT.toUpperCase() === "FOREIGN" &&
        reqData.APPROVAL_FLOW_TYPE.toUpperCase() === "LONG"
      ) {
        if (isEmpty(reqData.CONVERSION_RATE)) {
          return res.status(400).send({
            message: `Please Give Conversion Rate.`,
            status: 400,
          });
        }
        templateObject.APPROVAL_FLOW_TYPE = finalData.APPROVAL_FLOW_TYPE;
        templateObject.BUYER_DEPARTMENT = finalData.BUYER_DEPARTMENT;
        templateObject.AMOUNT = finalData.TOTAL_AMOUNT;
        templateObject.ORG_ID = finalData.ORG_ID;
        templateObject.MODULE_NAME = "Foreign CS Approval";
      }
      if (reqData.APPROVAL_FLOW_TYPE.toUpperCase() === "SHORT") {
        templateObject.APPROVAL_FLOW_TYPE = finalData.APPROVAL_FLOW_TYPE;
        templateObject.BUYER_DEPARTMENT = finalData.BUYER_DEPARTMENT;
        //templateObject.AMOUNT = finalData.TOTAL_AMOUNT;
        templateObject.ORG_ID = finalData.ORG_ID;
        templateObject.MODULE_NAME = "Short Invoice Approval";
      }

      //! Get Approval Template
      if (isEmpty(reqData.CS_ID)) {
        let templateResult = await templateModel.anyTemplateIDFind(
          templateObject
        ); //csModel.csTemplateFind(templateObject);
        console.log("Template: ", templateResult);
        await commonObject.makeArrayObject(templateResult);

        if (isEmpty(templateResult.queryResult.finalData)) {
          return res.status(400).send({
            message: `No Approval Hierarchy Found For ${reqData.BUYER_DEPARTMENT} CS! Please Create A Approval Hierarchy First.`,
            status: 400,
            msg_type: "dialog",
          });
        }
        finalData.TEMPLATE_ID = templateResult.queryResult.finalData[0].AS_ID;
        finalData.TEMPLATE_STAGE_LEVEL = 1;
      }

      //Create CS
      if (isEmpty(reqData.CS_ID)) {
        const poLineMap = {}; // To keep track of assigned ITEM_LINE_NUM for each RFQ_LINE_ID
        let nextLineNum = 1; // Initial ITEM_LINE_NUM to assign

        let queryResultList = await csModel.addNewCSHeader(finalData);
        console.log(queryResultList.outBinds[0][0]);
        if (queryResultList.rowsAffected > 0) {
          let RFQ_LINE_ID = [];
          for (let i = 0; i < reqData.ITEMS.length; i++) {
            finalItemData = { ...reqData.ITEMS[i] };
            finalItemData.CS_ID = queryResultList.outBinds[0][0];
            finalItemData.RECOMMENDED_BY = userId;
            const rfqLineId = reqData.ITEMS[i].RFQ_LINE_ID;
            // Check if RFQ_LINE_ID exists
            if (rfqLineId) {
              // Check if the RFQ_LINE_ID is already in the map
              if (!poLineMap[rfqLineId]) {
                // Assign the next available ITEM_LINE_NUM and increment the counter
                poLineMap[rfqLineId] = nextLineNum++;
              }
              // Assign the mapped ITEM_LINE_NUM to the current item
              finalItemData.ITEM_LINE_NUM = poLineMap[rfqLineId];
            }
            let queryResultLines = await csModel.addNewCSLineItem(
              finalItemData
            );
            RFQ_LINE_ID.push(reqData.ITEMS[i].RFQ_LINE_ID);
          }
          value.message = "New CS Created Successfully";
          value.status = 200;
          let queryResultLineId = await csModel.csItemStatusUpdate(
            RFQ_LINE_ID,
            1
          );
          return res.status(value.status).json(value);
        } else {
          value.message = "CS Not Created. Try Again.";
          value.status = 400;
          return res.status(value.status).json(value);
        }
      }
      if (!isEmpty(reqData.CS_ID)) {
        let updateQueryResult = await csModel.csUpdate(updateData, whereData);

        if (updateQueryResult.rowsAffected > 0) {
          value.message = "CS Updated Successfully";
          value.status = 200;
          if (!isEmpty(reqData.ITEMS)) {
            for (let i = 0; i < reqData.ITEMS.length; i++) {
              console.log("CS_LINE_ID", reqData.ITEMS[i].CS_LINE_ID);
              whereLinesData.CS_LINE_ID = reqData.ITEMS[i].CS_LINE_ID;
              updateLinesData = { ...reqData.ITEMS[i] };
              let {
                CS_LINE_ID,
                RFQ_ID,
                RFQ_LINE_ID,
                QUOT_LINE_ID,
                ...newData
              } = updateLinesData;
              updateLinesData = newData;
              if (
                !isEmpty(reqData.ITEMS[i].AWARDED) ||
                !isEmpty(reqData.ITEMS[i].CS_LINE_ID) ||
                reqData.ITEMS[i].CS_LINE_ID != undefined ||
                reqData.ITEMS[i].CS_LINE_ID != null ||
                reqData.ITEMS[i].CS_LINE_ID != ""
              ) {
                updateLinesData.AWARDED_BY = userId;
              }
              let queryResultLines = await csModel.csLineUpdate(
                updateLinesData,
                whereLinesData
              );

              if (
                isEmpty(reqData.ITEMS[i].CS_LINE_ID) ||
                reqData.ITEMS[i].CS_LINE_ID === undefined ||
                reqData.ITEMS[i].CS_LINE_ID == null ||
                reqData.ITEMS[i].CS_LINE_ID === ""
              ) {
                console.log("LINE_ID", reqData.ITEMS[i].CS_LINE_ID);
                let { CS_LINE_ID, ...itemData } = reqData.ITEMS[i]; // Destructure and remove CS_LINE_ID
                itemData.CS_ID = reqData.CS_ID;
                console.log("Item: ", itemData);
                let insertQueryResultLines = await csModel.addNewCSLineItem(
                  itemData
                );
                console.log("Insert when update: ", insertQueryResultLines);
              }

              console.log(queryResultLines);
            }
          }
          return res.status(value.status).json(value);
        } else {
          value.message = "CS Not Updated. Try Again.";
          value.status = 400;
          return res.status(value.status).json(value);
        }
      }
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.post(`/list`, verifyToken, userRoleAuthorization, async (req, res) => {
  try {
    let finalData = {};
    let value = {
      message: `CS List`,
      status: 200,
      total: 0,
      data: [],
    };
    //userId = req.user ? req.user.USER_ID : null;
    let reqData = {
      FROM_DATE: req.body.FROM_DATE,
      TO_DATE: req.body.TO_DATE,
      CS_STATUS: req.body.CS_STATUS,
      SEARCH_FIELD: req.body.SEARCH_FIELD,
      OFFSET: req.body.OFFSET,
      LIMIT: req.body.LIMIT,
    };

    // List Total
    let queryResultTotal = await csModel.csListTotal(
      reqData.FROM_DATE,
      reqData.TO_DATE,
      reqData.CS_STATUS,
      reqData.SEARCH_FIELD
    );
    await commonObject.makeArrayObject(queryResultTotal);
    let rowObject = await commonObject.convertArrayToObject(
      queryResultTotal.queryResult.finalData
    );
    value.total = rowObject.TOTAL;

    // List
    let queryResultList = await csModel.csList(
      reqData.FROM_DATE,
      reqData.TO_DATE,
      reqData.CS_STATUS,
      reqData.SEARCH_FIELD,
      reqData.OFFSET,
      reqData.LIMIT
    );
    await commonObject.makeArrayObject(queryResultList);
    value.data = queryResultList.queryResult.finalData;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(
  `/cs-details`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let finalData = {};
      let value = {
        message: `CS Details`,
        status: 200,
        total: 0,
        data: [],
      };
      //userId = req.user ? req.user.USER_ID : null;
      let reqData = {
        CS_ID: req.body.CS_ID,
      };
      if (isEmpty(reqData.CS_ID)) {
        return res
          .status(400)
          .send({ message: "Please Give CS ID.", status: 400 });
      }

      // List
      let queryResultTotal = await csModel.csDetailsItemTotal(reqData.CS_ID);

      await commonObject.makeArrayObject(queryResultTotal);
      let rowObject = await commonObject.convertArrayToObject(
        queryResultTotal.queryResult.finalData
      );
      value.total = rowObject.TOTAL;

      // List
      let queryResultList = await csModel.csDetails(reqData.CS_ID);
      await commonObject.makeArrayObject(queryResultList);
      value.data = queryResultList.queryResult.finalData;
      return res.status(200).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.post(
  `/cs-item-delete`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let finalData = {};
      let value = {
        message: ``,
        status: 200,
      };
      //userId = req.user ? req.user.USER_ID : null;
      let reqData = {
        CS_LINE_ID: req.body.CS_LINE_ID,
        RFQ_LINE_ID: req.body.RFQ_LINE_ID,
      };
      if (!Array.isArray(reqData.CS_LINE_ID)) {
        return res
          .status(400)
          .send({ message: "Item Should Be Array.", status: 400 });
      }
      if (!Array.isArray(reqData.RFQ_LINE_ID)) {
        return res
          .status(400)
          .send({ message: "RFQ Line Item Should Be Array.", status: 400 });
      }

      // List
      let queryResult = await csModel.csItemDelete(reqData.CS_LINE_ID);
      console.log(`queryResult`, queryResult);
      if (queryResult.rowsAffected > 0) {
        let queryResultLineId = await csModel.csItemStatusUpdate(
          reqData.RFQ_LINE_ID,
          0
        );
        console.log(`queryResultLineId`, queryResultLineId);
        value.message = "Item Removed Successfully.";
        return res.status(200).json(value);
      } else {
        value.message = "Item Not Removed. Try Again.";
        return res.status(400).json(value);
      }
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.post(
  `/pending-list`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    let filepath1 = `${process.env.backend_url}${process.env.profile_pic_file_path_name}`;
    let filepath2 = `${process.env.backend_url}${process.env.profile_pic2_file_path_name}`;
    try {
      let finalData = {};
      let value = {
        message: `CS List`,
        status: 200,
        profile_pic: filepath1,
        //profile_pic2: filepath2,
        total: 0,
        data: [],
      };
      userId = req.user ? req.user.USER_ID : null;
      let reqData = {
        FROM_DATE: req.body.FROM_DATE,
        TO_DATE: req.body.TO_DATE,
        CS_STATUS: req.body.CS_STATUS,
        OFFSET: req.body.OFFSET,
        LIMIT: req.body.LIMIT,
      };

      // List Total
      let queryResultListTotal = await csModel.csPendingListTotal(
        userId,
        reqData.FROM_DATE,
        reqData.TO_DATE,
        reqData.CS_STATUS
      );
      await commonObject.makeArrayObject(queryResultListTotal);
      let rowObject = await commonObject.convertArrayToObject(
        queryResultListTotal.queryResult.finalData
      );
      value.total = rowObject.TOTAL;

      // List
      let queryResultList = await csModel.csPendingList(
        userId,
        reqData.FROM_DATE,
        reqData.TO_DATE,
        reqData.CS_STATUS,
        reqData.OFFSET,
        reqData.LIMIT
      );
      await commonObject.makeArrayObject(queryResultList);
      for (let i = 0; i < queryResultList.queryResult.finalData.length; i++) {
        let queryResult = await ouModel.ouListByID(
          queryResultList.queryResult.finalData[i].ORG_ID
        );
        await commonObject.makeArrayObject(queryResult);
        //console.log(queryResult);
        let rowObject = await commonObject.convertArrayToObject(
          queryResult.queryResult.finalData
        );
        //console.log(rowObject);
        queryResultList.queryResult.finalData[i].SHORT_CODE =
          rowObject.SHORT_CODE;
        queryResultList.queryResult.finalData[i].NAME = rowObject.NAME;
      }
      value.data = queryResultList.queryResult.finalData;
      return res.status(200).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.post(
  `/supplier-list`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let finalData = {};
      let value = {
        message: `Supplier List`,
        status: 200,
        data: [],
      };
      //userId = req.user ? req.user.USER_ID : null;
      let reqData = {
        RFQ_ID: req.body.RFQ_ID,
      };

      // List
      let queryResultList = await csModel.supplierList(reqData.RFQ_ID);
      await commonObject.makeArrayObject(queryResultList);
      value.data = queryResultList.queryResult.finalData;
      return res.status(200).json(value);
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.post(
  `/supplier-term-set`,
  verifyToken,
  userRoleAuthorization,
  async (req, res) => {
    try {
      let finalData = {};
      let whereData = {};
      let updateData = {};
      let value = {
        message: `Supplier List`,
        status: 200,
      };
      userId = req.user ? req.user.USER_ID : null;
      let reqData = {
        INVITATION_ID: req.body.INVITATION_ID,
        GENERAL_TERMS: req.body.GENERAL_TERMS,
      };

      if (isEmpty(reqData.INVITATION_ID)) {
        return res
          .status(400)
          .send({ message: "Please Give Invitation ID", status: 400 });
      }

      // let { ITEMS, ...newDta } = finalData;
      //   finalData = newDta;

      finalData.LAST_UPDATED_BY = userId;
      console.log(finalData);

      Object.entries(reqData).forEach(([key, value]) => {
        if (value && key == "INVITATION_ID") {
          whereData[key] = value;
        }
      });

      Object.entries(reqData).forEach(([key, value]) => {
        if (
          value &&
          key !== "INVITATION_ID" &&
          value &&
          key !== "RFQ_ID" &&
          value &&
          key !== "USER_ID"
        ) {
          updateData[key] = value;
        }
      });

      // List
      let queryResultList = await csModel.supplierCSTermUpdate(
        updateData,
        whereData
      );

      if (queryResultList.rowsAffected > 0) {
        value.message = "Term Updated Successfully";
        value.status = 200;
        return res.status(value.status).json(value);
      } else {
        value.message = "Term Not Updated. Please Try Again.";
        value.status = 400;
        return res.status(value.status).json(value);
      }
    } catch (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.post(`/po-list-by-cs`, verifyToken, async (req, res) => {
  try {
    let value = {
      message: `PO List`,
      status: 200,
      data: [],
    };
    let reqData = {
      CS_ID: req.body.CS_ID,
    };

    if (isEmpty(reqData.CS_ID)) {
      value.message = "Please Give CS ID.";
      value.status = 400;
      return res.status(value.status).json(value);
    }

    // List
    let queryResultList = await csModel.poList(reqData.CS_ID);
    await commonObject.makeArrayObject(queryResultList);
    if (queryResultList.queryResult.finalData.length === 1) {
      if (queryResultList.queryResult.finalData[0].PO_NUMBER === "") {
        value.data = [];
      }
    } else value.data = queryResultList.queryResult.finalData;
    return res.status(200).json(value);
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});
module.exports = router;
