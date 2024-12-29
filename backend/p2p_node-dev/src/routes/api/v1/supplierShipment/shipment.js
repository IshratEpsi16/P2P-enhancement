const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const shipmentModel = require("../../../../models/api/v1/supplierShipment/shipment");
const commonModel = require("../../../../models/api/v1/common/orgNameById");
const siteModel = require("../../../../models/api/v1/supplierApproval/supplierRegistrationSiteCreation");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const {
  userPermissionAuthorization,
  userRoleAuthorization,
} = require("../../../../middleware/authorization");
const isEmpty = require("is-empty");
const fileUploaderCommonObject = require("../../../../common/api/v1/fileUploader");
const logger = require("../../../../common/api/v1/logger");
const rfqModel = require("../../../../models/api/v1/pr2po/pr/rfqPreparation");

router.post(`/po-item-list`, verifyToken, async (req, res) => {
  let finalData = {};
  try {
    let value = {
      message: ``,
      status: 200,
      data: [],
    };
    userId = req.user ? req.user.USER_ID : null;
    let reqData = {
      PO_HEADER_ID: req.body.PO_HEADER_ID,
      PO_NUMBER: req.body.PO_NUMBER,
    };
    console.log(reqData);
    if (isEmpty(reqData.PO_HEADER_ID) || isEmpty(reqData.PO_NUMBER)) {
      return res.status(400).send({
        message: "Please give PO Header ID or PO Number",
        status: 400,
      });
    }
    Object.entries(reqData).forEach(([key, value]) => {
      if (!isEmpty(value)) {
        finalData[key] = value;
      }
    });

    let queryResult = await shipmentModel.poItemList(finalData);
    await commonObject.makeArrayObject(queryResult);
    value.data = queryResult.queryResult.finalData;
    value.message = "PO Item List";
    value.status = 200;
    return res.status(value.status).json(value);
  } catch (error) {
    logger.info(error);
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/add-update`, verifyToken, async (req, res) => {
  try {
    let finalData = {};
    let finalDataItems = {};
    let itemList = [];
    let willUpdate = false;
    let updateData = {};
    let whereData = {};
    let whereLinesData = {};
    let updateLinesData = {};
    let value = {
      message: ``,
      status: 200,
    };
    userId = req.user ? req.user.USER_ID : null;
    let reqData = {
      SHIPMENT_ID: req.body.SHIPMENT_ID,
      RFQ_ID: req.body.RFQ_ID,
      CS_ID: req.body.CS_ID,
      SHIP_FROM_LOCATION_ID: req.body.SHIP_FROM_LOCATION_ID,
      BILL_TO_LOCATION_ID: req.body.BILL_TO_LOCATION_ID,
      SHIPMENT_DATE: req.body.SHIPMENT_DATE,
      EST_DELIVERY_DATE: req.body.EST_DELIVERY_DATE,
      LC_NUMBER: req.body.LC_NUMBER,
      BL_CHALLAN_NUMBER: req.body.BL_CHALLAN_NUMBER,
      VAT_CHALLAN_NUMBER: req.body.VAT_CHALLAN_NUMBER,
      DELIVERY_CHALLAN_NUMBER: req.body.DELIVERY_CHALLAN_NUMBER,
      STATUS: req.body.STATUS,
      PO_NUMBER: req.body.PO_NUMBER,
      PO_HEADER_ID: req.body.PO_HEADER_ID,
      ORG_ID: req.body.ORG_ID,
      FILE: req.body.FILE,
      SHIP_NUM: req.body.SHIP_NUM,
      GATE_RCV_STATUS: req.body.GATE_RCV_STATUS,
      GATE_RCV_REMARKS: req.body.GATE_RCV_REMARKS,
      ITEM: req.body.ITEM,
    };

    if (isEmpty(reqData.ITEM) || !Array.isArray(reqData.ITEM)) {
      value.message = "Item Should Be Array.";
      value.status = 400;
      return res.status(value.status).json(value);
    }

    Object.entries(reqData).forEach(([key, value]) => {
      if (
        !isEmpty(value) &&
        key != "FILE" &&
        key != "SHIPMENT_DATE" &&
        key != "EST_DELIVERY_DATE" &&
        key != "ITEM"
      ) {
        finalData[key] = value;
      } else if (key == "SHIPMENT_DATE" || key == "EST_DELIVERY_DATE") {
        let val = new Date(value);
        finalData[key] = val;
      }
    });

    //!Item Mapping

    reqData.ITEM.forEach((item) => {
      const {
        CS_LINE_ID,
        ITEM_CODE,
        ITEM_DESCRIPTION,
        LCM_ENABLE,
        OFFERED_QUANTITY,
        SHIPPING_QUANTITY,
        PO_HEADER_ID,
        PO_NUMBER,
        PO_LINE_ID,
        PO_LINE_NUMBER,
        SHIP_NUM,
      } = item;

      // Validate Offered Quantity
      if (isEmpty(OFFERED_QUANTITY)) {
        return res.status(400).send({
          message: "Please give Offered Quantity.",
          status: 400,
        });
      }
      if (isNaN(OFFERED_QUANTITY)) {
        return res.status(400).send({
          message: "Offered Quantity Should Be Number.",
          status: 400,
        });
      }

      // Validate Shipping Quantity
      if (isEmpty(SHIPPING_QUANTITY)) {
        return res.status(400).send({
          message: "Please give Shipping Quantity.",
          status: 400,
        });
      }

      if (isNaN(SHIPPING_QUANTITY)) {
        return res.status(400).send({
          message: "Shipping Quantity Should Be Number.",
          status: 400,
        });
      }

      // Construct item object after validation
      itemList.push({
        CS_LINE_ID,
        ITEM_CODE,
        ITEM_DESCRIPTION,
        LCM_ENABLE,
        OFFERED_QUANTITY,
        SHIPPING_QUANTITY,
        PO_HEADER_ID,
        PO_NUMBER,
        PO_LINE_ID,
        PO_LINE_NUMBER,
        SHIP_NUM,
        CREATED_BY: userId,
      });
    });

    // Object.entries(reqData.ITEM).forEach(([key, value]) => {
    //   if (!isEmpty(value)) {
    //     finalDataItems[key] = value;
    //   }
    //   itemList.push(finalDataItems);
    // });
    finalData.CREATED_BY = userId;
    finalData.USER_ID = userId;

    if (req.files && Object.keys(req.files).length > 0 && req.files.FILE) {
      fileUploadCode = await fileUploaderCommonObject.uploadFile(
        req,
        "shipmentHeader",
        "FILE"
      );

      if (fileUploadCode.success == false)
        return res.status(400).send({
          success: false,
          status: 400,
          message: fileUploadCode.message,
        });
      console.log(fileUploadCode.message);

      finalData.FILE_NAME = fileUploadCode.fileName;
      finalData.FILE_ORG_NAME = fileUploadCode.fileOriginalName;
    }

    // Add
    if (isEmpty(reqData.SHIPMENT_ID)) {
      let queryResultItem = {};
      let queryResult = await shipmentModel.addNew(finalData, itemList);
      console.log(queryResult.outBinds[0][0]);

      if (!isEmpty(queryResult.outBinds[0][0])) {
        value.message = "Shipment Created Successfully.";
        value.status = 200;
        return res.status(value.status).json(value);
      }
      if (queryResultItem.rowsAffected < 1 || queryResultItem === undefined) {
        // let queryResultDelete = await shipmentModel.deleteShipment(
        //   queryResult.outBinds[0][0]
        // );
        value.message = "Shipment Not Created! PLease Try Again.";
        value.status = 400;
        return res.status(value.status).json(value);
      }
    }
    if (!isEmpty(reqData.SHIPMENT_ID)) {
      Object.entries(finalData).forEach(([key, value]) => {
        if (!isEmpty(value) && key != "SHIPMENT_ID") {
          updateData[key] = value;
        }
      });
      whereData.SHIPMENT_ID = reqData.SHIPMENT_ID;
      let queryResult = await shipmentModel.updateData(updateData, whereData);

      if (queryResult.rowsAffected > 0 && queryResult !== undefined) {
        for (let i = 0; i < reqData.ITEM.length; i++) {
          const updateLinesData = {};
          const whereLinesData = {};

          Object.entries(reqData.ITEM[i]).forEach(([key, value]) => {
            if (!isEmpty(value) && key !== "SHIPMENT_LINE_ID") {
              updateLinesData[key] = value;
            }
          });
          whereLinesData.SHIPMENT_LINE_ID = reqData.ITEM[i].SHIPMENT_LINE_ID;

          try {
            let itemResult = await shipmentModel.updateDataLines(
              updateLinesData,
              whereLinesData
            );
            console.log("Item: ", itemResult.rowsAffected);
          } catch (error) {
            console.error("Error updating item:", error);
            // Handle the error as needed
          }
        }

        if (
          queryResult.rowsAffected > 0 &&
          reqData.GATE_RCV_STATUS === "ACCEPTED"
        ) {
          const finalGRN = {};
          finalGRN.PO_NUMBER = reqData.PO_NUMBER;
          finalGRN.ORG_ID = reqData.ORG_ID;
          finalGRN.SHIP_NUM = reqData.SHIP_NUM;
          let grnResult = await shipmentModel.createGRN(finalGRN);
          console.log("grn", grnResult);
        }

        const value = {
          message: "Information Updated Successfully.",
          status: 200,
        };
        return res.status(200).json(value);
      } else {
        value.message = "Information Not Updated.";
        value.status = 400;
        return res.status(400).json(value);
      }
    }
  } catch (error) {
    logger.info(error);
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/list`, verifyToken, async (req, res) => {
  try {
    const {
      USER_ID,
      PO_HEADER_ID,
      PO_NUMBER,
      LC_NUMBER,
      BL_CHALLAN_NUMBER,
      VAT_CHALLAN_NUMBER,
      DELIVERY_CHALLAN_NUMBER,
      GATE_RCV_STATUS,
      STATUS,
      FROM_DATE,
      TO_DATE,
      OFFSET = 0,
      LIMIT,
    } = req.body;

    if (OFFSET === null || OFFSET === "") {
      return res
        .status(400)
        .json({ message: "Please provide offset.", status: 400 });
    }
    if (isEmpty(LIMIT)) {
      return res
        .status(400)
        .json({ message: "Please provide limit.", status: 400 });
    }

    const finalData = {
      OFFSET: Number(OFFSET),
      LIMIT: Number(LIMIT),
      USER_ID,
      PO_HEADER_ID,
      PO_NUMBER,
      LC_NUMBER,
      BL_CHALLAN_NUMBER,
      VAT_CHALLAN_NUMBER,
      DELIVERY_CHALLAN_NUMBER,
      GATE_RCV_STATUS,
      STATUS,
      FROM_DATE,
      TO_DATE,
    };

    // Remove empty fields
    Object.keys(finalData).forEach(
      (key) =>
        (finalData[key] === undefined || finalData[key] === "") &&
        delete finalData[key]
    );

    const [listResult, totalResult] = await Promise.all([
      shipmentModel.byWhere(finalData),
      shipmentModel.byWhereTotalCount(finalData),
    ]);

    await Promise.all([
      commonObject.makeArrayObject(listResult),
      commonObject.makeArrayObject(totalResult),
    ]);

    const total = await commonObject.convertArrayToObject(
      totalResult.queryResult.finalData
    );

    const enhancedList = await Promise.all(
      listResult.queryResult.finalData.map(async (item) => {
        const [ouListResult, shipFromResult, rfqDetails] = await Promise.all([
          commonModel.ouListByID(item.BILL_TO_LOCATION_ID),
          siteModel.getDataByWhereCondition(item.SHIP_FROM_LOCATION_ID),
          rfqModel.rfqHeaderDetails({ RFQ_ID: item.RFQ_ID }),
        ]);

        await Promise.all([
          commonObject.makeArrayObject(ouListResult),
          commonObject.makeArrayObject(shipFromResult),
          commonObject.makeArrayObject(rfqDetails),
        ]);

        const [BILL_TO_LOCATION, SHIP_FROM_LOCATION, RFQ_DETAILS] =
          await Promise.all([
            commonObject.convertArrayToObject(
              ouListResult.queryResult.finalData
            ),
            commonObject.convertArrayToObject(
              shipFromResult.queryResult.finalData
            ),
            commonObject.convertArrayToObject(rfqDetails.queryResult.finalData),
          ]);

        return { ...item, BILL_TO_LOCATION, SHIP_FROM_LOCATION, RFQ_DETAILS };
      })
    );

    res.status(200).json({
      message: "Shipment List",
      status: 200,
      total: total.TOTAL,
      data: enhancedList,
    });
  } catch (error) {
    //logger.error("Error in /list endpoint:", error);
    res.status(500).json({ error: "Internal server error", status: 500 });
  }
});

router.post(`/shipment-details`, verifyToken, async (req, res) => {
  let finalData = {};
  try {
    let value = {
      message: ``,
      status: 200,
      data: [],
    };
    let reqData = {
      SHIPMENT_ID: req.body.SHIPMENT_ID,
    };
    if (isEmpty(reqData.SHIPMENT_ID)) {
      value.message = "Please Give Shipment ID.";
      value.status = 400;
      return res.status(value.status).json(value);
    }
    let query = await shipmentModel.shipmentDetails(reqData.SHIPMENT_ID);
    await commonObject.makeArrayObject(query);
    // console.log(query.queryResult.finalData);

    value.data = query.queryResult.finalData;
    value.message = "Shipment Details";
    value.status = 200;
    return res.status(value.status).json(value);
  } catch (error) {
    //logger.info(error);
    logger.error(error);
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/shipment-item`, verifyToken, async (req, res) => {
  let finalData = {};
  try {
    let value = {
      message: ``,
      status: 200,
      data: [],
    };
    let reqData = {
      PO_NUMBER: req.body.PO_NUMBER,
    };
    if (isEmpty(reqData.PO_NUMBER)) {
      value.message = "Please Give PO Number.";
      value.status = 400;
      return res.status(value.status).json(value);
    }
    let query = await shipmentModel.shipmentItem(reqData.PO_NUMBER);
    await commonObject.makeArrayObject(query);
    // console.log(query.queryResult.finalData);

    value.data = query.queryResult.finalData;
    value.message = "Shipment Item";
    value.status = 200;
    return res.status(value.status).json(value);
  } catch (error) {
    //logger.info(error);
    logger.error(error);
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(
  `/gate-receive`,
  verifyToken,
  userPermissionAuthorization(["ShipmentGateRcv"]),
  async (req, res) => {
    let whereData = {};
    let updateData = {};
    let finalGRN = {};
    userId = req.user ? req.user.USER_ID : null;
    try {
      let value = {
        message: ``,
        status: 200,
      };
      let reqData = {
        SHIPMENT_ID: req.body.SHIPMENT_ID,
        GATE_RCV_STATUS: req.body.GATE_RCV_STATUS,
        GATE_RCV_REMARKS: req.body.GATE_RCV_REMARKS,
        PO_NUMBER: req.body.PO_NUMBER,
        ORG_ID: req.body.ORG_ID,
      };
      console.log(reqData);

      if (isEmpty(reqData.SHIPMENT_ID)) {
        value.message = "PLease Give Shipment ID.";
        value.status = 400;
        return res.status(value.status).json(value);
      }
      if (isEmpty(reqData.PO_NUMBER)) {
        value.message = "PLease Give PO Number.";
        value.status = 400;
        return res.status(value.status).json(value);
      }
      if (isEmpty(reqData.ORG_ID)) {
        value.message = "PLease Give ORG ID.";
        value.status = 400;
        return res.status(value.status).json(value);
      }
      // if (isEmpty(reqData.GATE_RCV_STATUS)) {
      //   value.message = "PLease Give Gate Receive Status.";
      //   value.status = 400;
      //   return res.status(value.status).json(value);
      // }

      if ((reqData.PO_STATUS = "REJECTED")) {
        if (isEmpty(reqData.GATE_RCV_REMARKS)) {
          value.message = "PLease Give Reason For Rejection.";
          value.status = 400;
          return res.status(value.status).json(value);
        }
      }
      updateData.GATE_RCV_STATUS = reqData.GATE_RCV_STATUS;
      updateData.GATE_RCV_REMARKS = reqData.GATE_RCV_REMARKS;
      updateData.RECEIVED_BY = userId;
      whereData.SHIPMENT_ID = reqData.SHIPMENT_ID;

      finalGRN.PO_NUMBER = reqData.PO_NUMBER;
      finalGRN.ORG_ID = reqData.ORG_ID;

      //! Data
      let queryResultUpdate = await shipmentModel.shipmentUpdate(
        updateData,
        whereData
      );

      console.log(queryResultUpdate);
      value.message =
        queryResultUpdate.rowsAffected > 0
          ? "Information Updated Successfully"
          : "Information Not Updated! Pease Try Again.";
      value.status = queryResultUpdate.rowsAffected > 0 ? 200 : 500;
      console.log("finalGRN", finalGRN);
      if (value.status === 200 && reqData.GATE_RCV_STATUS === "ACCEPTED") {
        let grnResult = await shipmentModel.createGRN(finalGRN);
        console.log("grn", grnResult);
      }
      return res.status(value.status).json(value);
    } catch (error) {
      logger.info(error);
      logger.error(error);
      console.error("Error querying database:", error);
      res.status(500).json({ error: "Database query error" });
    }
  }
);

router.post(`/timeline`, verifyToken, async (req, res) => {
  let finalData = {};
  try {
    let value = {
      message: ``,
      status: 200,
      data: [],
    };
    let reqData = {
      SHIPMENT_ID: req.body.SHIPMENT_ID,
    };
    if (isEmpty(reqData.SHIPMENT_ID)) {
      value.message = "Please Give Shipment ID.";
      value.status = 400;
      return res.status(value.status).json(value);
    }
    let query = await shipmentModel.shipmentTimeline(reqData.SHIPMENT_ID);
    await commonObject.makeArrayObject(query);
    console.log(query.queryResult.finalData);

    value.data = query.queryResult.finalData;
    value.message = "Shipment Timeline";
    value.status = 200;
    return res.status(value.status).json(value);
  } catch (error) {
    //logger.info(error);
    logger.error(error);
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/check-shipment-number`, verifyToken, async (req, res) => {
  let finalData = {};
  try {
    let value = {
      message: ``,
      status: 200,
      msg_type: "dialog",
      data: {},
      items: [],
    };
    let reqData = {
      PO_NUMBER: req.body.PO_NUMBER,
    };
    if (isEmpty(reqData.PO_NUMBER)) {
      value.message = "Please Give PO Number.";
      value.status = 400;
      return res.status(value.status).json(value);
    }
    let query,
      queryItem = {};
    [query, queryItem] = await Promise.all([
      shipmentModel.getShipmentNumberFromEBS(reqData.PO_NUMBER),
      shipmentModel.getShipmentItemsFromEBS(reqData.PO_NUMBER),
    ]);
    await Promise.all([
      commonObject.makeArrayObject(query),
      commonObject.makeArrayObject(queryItem),
    ]);

    value.data = query.queryResult.finalData[0];
    value.item = queryItem.queryResult.finalData;
    value.message = "Shipment Number";
    value.status = 200;
    return res.status(value.status).json(value);
  } catch (error) {
    //logger.info(error);
    logger.error(error);
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});
module.exports = router;
