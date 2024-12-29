const express = require("express");
const router = express.Router();
router.use(express.json());
const verifyToken = require("../../../../middleware/jwtValidation");
const oracledb = require("oracledb");
const commonObject = require("../../../../common/api/v1/common");
const hierarchyModel = require("./../../../../models/api/v1/common/hierarchyByModule");
//const getUserRolePermission = require("../authentication/authorization_role_permission");
const isEmpty = require("is-empty");

router.post(`/list-by-module`, verifyToken, async (req, res) => {
  let filepath = `${process.env.backend_url}${process.env.profile_pic_file_path_name}`;
  let reqData = {
    SUPPLIER_ID: req.body.SUPPLIER_ID,
    MODULE_NAME: req.body.MODULE_NAME,
  };

  try {
    let value = {
      message: `Hierarchy List`,
      status: 200,
      total: 0,
      profile_pic: filepath,
      data: [],
    };

    if (isEmpty(reqData.SUPPLIER_ID)) {
      let value = {
        message: `Enter ID Supplier ID`,
        status: 400,
      };
      return res.status(400).json(value);
    }
    if (isEmpty(reqData.MODULE_NAME)) {
      let value = {
        message: `Enter Module Name`,
        status: 400,
      };
      return res.status(400).json(value);
    } else {
      let hierarchyListQueryResult = await hierarchyModel.approverList(
        reqData.SUPPLIER_ID,
        reqData.MODULE_NAME
      );
      await commonObject.makeArrayObject(hierarchyListQueryResult);
      console.log(hierarchyListQueryResult.queryResult.finalData);

      // Grouping by STAGE_LEVEL
      // const groupedData = groupByStageLevel(
      //   hierarchyListQueryResult.queryResult.finalData
      // );

      // // Rename the keys to data_1, data_2, ...
      // const renamedData = {};
      // groupedData.forEach((group, index) => {
      //   const stageLevel = index + 1;
      //   //renamedData[`step`] = group;
      //   renamedData[`data_${stageLevel}`] = group;
      // });

      //value.total = groupedData.length;
      value.data = hierarchyListQueryResult.queryResult.finalData;
      return res.status(200).json(value);
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/cs-list`, verifyToken, async (req, res) => {
  let filepath = `${process.env.backend_url}${process.env.profile_pic_file_path_name}`;
  let reqData = {
    MODULE_NAME: req.body.MODULE_NAME,
    OBJECT_ID: req.body.OBJECT_ID,
    OBJECT_TYPE_CODE: req.body.OBJECT_TYPE_CODE,
  };

  try {
    let value = {
      message: `CS Hierarchy List`,
      status: 200,
      profile_pic: filepath,
      data: [],
    };
    if (isEmpty(reqData.MODULE_NAME)) {
      let value = {
        message: `Enter Module Name`,
        status: 400,
      };
      return res.status(400).json(value);
    }
    if (isEmpty(reqData.OBJECT_ID)) {
      let value = {
        message: `Enter Object ID`,
        status: 400,
      };
      return res.status(400).json(value);
    }
    if (isEmpty(reqData.OBJECT_TYPE_CODE)) {
      let value = {
        message: `Enter Object Type Code`,
        status: 400,
      };
      return res.status(400).json(value);
    } else {
      let hierarchyListQueryResult = await hierarchyModel.approverListCS(
        reqData.MODULE_NAME,
        reqData.OBJECT_ID,
        reqData.OBJECT_TYPE_CODE
      );
      await commonObject.makeArrayObject(hierarchyListQueryResult);
      console.log(hierarchyListQueryResult.queryResult.finalData);
      //value.total = groupedData.length;
      value.data = hierarchyListQueryResult.queryResult.finalData;
      return res.status(200).json(value);
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/profile-update-list`, verifyToken, async (req, res) => {
  let filepath = `${process.env.backend_url}${process.env.profile_pic_file_path_name}`;
  let reqData = {
    SUPPLIER_ID: req.body.SUPPLIER_ID,
    MODULE_NAME: req.body.MODULE_NAME,
    PROFILE_UPDATE_UID: req.body.PROFILE_UPDATE_UID,
  };

  try {
    let value = {
      message: `Hierarchy List`,
      status: 200,
      total: 0,
      profile_pic: filepath,
      data: [],
    };

    if (isEmpty(reqData.SUPPLIER_ID)) {
      let value = {
        message: `Enter ID Supplier ID`,
        status: 400,
      };
      return res.status(400).json(value);
    }
    if (isEmpty(reqData.MODULE_NAME)) {
      let value = {
        message: `Enter Module Name`,
        status: 400,
      };
      return res.status(400).json(value);
    }
    if (isEmpty(reqData.PROFILE_UPDATE_UID)) {
      let value = {
        message: `Enter Profile Update UID`,
        status: 400,
      };
      return res.status(400).json(value);
    } else {
      let hierarchyListQueryResult =
        await hierarchyModel.approverListProfileUpdate(
          reqData.SUPPLIER_ID,
          reqData.MODULE_NAME,
          reqData.PROFILE_UPDATE_UID
        );
      await commonObject.makeArrayObject(hierarchyListQueryResult);
      console.log(hierarchyListQueryResult.queryResult.finalData);

      // Grouping by STAGE_LEVEL
      // const groupedData = groupByStageLevel(
      //   hierarchyListQueryResult.queryResult.finalData
      // );

      // // Rename the keys to data_1, data_2, ...
      // const renamedData = {};
      // groupedData.forEach((group, index) => {
      //   const stageLevel = index + 1;
      //   //renamedData[`step`] = group;
      //   renamedData[`data_${stageLevel}`] = group;
      // });

      //value.total = groupedData.length;
      value.data = hierarchyListQueryResult.queryResult.finalData;
      return res.status(200).json(value);
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/profile-new-info-list`, verifyToken, async (req, res) => {
  let filepath = `${process.env.backend_url}${process.env.profile_pic_file_path_name}`;
  let reqData = {
    SUPPLIER_ID: req.body.SUPPLIER_ID,
    MODULE_NAME: req.body.MODULE_NAME,
    PROFILE_NEW_INFO_UID: req.body.PROFILE_NEW_INFO_UID,
  };

  try {
    let value = {
      message: `Hierarchy List`,
      status: 200,
      total: 0,
      profile_pic: filepath,
      data: [],
    };

    if (isEmpty(reqData.SUPPLIER_ID)) {
      let value = {
        message: `Enter ID Supplier ID`,
        status: 400,
      };
      return res.status(400).json(value);
    }
    if (isEmpty(reqData.MODULE_NAME)) {
      let value = {
        message: `Enter Module Name`,
        status: 400,
      };
      return res.status(400).json(value);
    }
    if (isEmpty(reqData.PROFILE_NEW_INFO_UID)) {
      let value = {
        message: `Enter Profile New Info UID`,
        status: 400,
      };
      return res.status(400).json(value);
    } else {
      let hierarchyListQueryResult =
        await hierarchyModel.approverListProfileNewInfo(
          reqData.SUPPLIER_ID,
          reqData.MODULE_NAME,
          reqData.PROFILE_NEW_INFO_UID
        );
      await commonObject.makeArrayObject(hierarchyListQueryResult);
      console.log(hierarchyListQueryResult.queryResult.finalData);

      // Grouping by STAGE_LEVEL
      // const groupedData = groupByStageLevel(
      //   hierarchyListQueryResult.queryResult.finalData
      // );

      // // Rename the keys to data_1, data_2, ...
      // const renamedData = {};
      // groupedData.forEach((group, index) => {
      //   const stageLevel = index + 1;
      //   //renamedData[`step`] = group;
      //   renamedData[`data_${stageLevel}`] = group;
      // });

      //value.total = groupedData.length;
      value.data = hierarchyListQueryResult.queryResult.finalData;
      return res.status(200).json(value);
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

router.post(`/invoice-hierarchy`, verifyToken, async (req, res) => {
  let filepath = `${process.env.backend_url}${process.env.profile_pic_file_path_name}`;
  let reqData = {
    SUPPLIER_ID: req.body.SUPPLIER_ID,
    MODULE_NAME: req.body.MODULE_NAME,
    INV_ID: req.body.INV_ID,
  };

  try {
    let value = {
      message: `Invoice Hierarchy List`,
      status: 200,
      total: 0,
      profile_pic: filepath,
      data: [],
    };

    if (isEmpty(reqData.SUPPLIER_ID)) {
      let value = {
        message: `Enter ID Supplier ID`,
        status: 400,
      };
      return res.status(400).json(value);
    }
    if (isEmpty(reqData.MODULE_NAME)) {
      let value = {
        message: `Enter Module Name`,
        status: 400,
      };
      return res.status(400).json(value);
    } else {
      let hierarchyListQueryResult = await hierarchyModel.invoiceApproverList(
        reqData.SUPPLIER_ID,
        reqData.MODULE_NAME,
        reqData.INV_ID
      );
      await commonObject.makeArrayObject(hierarchyListQueryResult);

      // Grouping by STAGE_LEVEL
      // const groupedData = groupByStageLevel(
      //   hierarchyListQueryResult.queryResult.finalData
      // );

      // // Rename the keys to data_1, data_2, ...
      // const renamedData = {};
      // groupedData.forEach((group, index) => {
      //   const stageLevel = index + 1;
      //   //renamedData[`step`] = group;
      //   renamedData[`data_${stageLevel}`] = group;
      // });

      //value.total = groupedData.length;
      value.data = hierarchyListQueryResult.queryResult.finalData;
      return res.status(200).json(value);
    }
  } catch (error) {
    console.error("Error querying database:", error);
    res.status(500).json({ error: "Database query error" });
  }
});

// Function to group data by STAGE_LEVEL
function groupByStageLevel(data) {
  const groupedData = {};
  data.forEach((item) => {
    const stageLevel = item.STAGE_LEVEL;
    if (!groupedData[stageLevel]) {
      groupedData[stageLevel] = [];
    }
    groupedData[stageLevel].push(item);
  });
  return Object.values(groupedData);
}

module.exports = router;
