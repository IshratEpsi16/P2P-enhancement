const {
  getPool,
  getGeneral,
} = require("../../../../connections/api/v1/connection");
const queries = require("../../../../queries/api/v1/pendingApplication/pendingInvoice");
const oracledb = require("oracledb");

let pendingInvoiceLocalTotal = async (
  APPROVER_ID,
  APPROVAL_STATUS,
  SEARCH_VALUE
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.pendingInvoiceLocalTotal();
    let result = await connectionP2pORACLE.execute(query, {
      APPROVER_ID: APPROVER_ID,
      APPROVAL_STATUS: APPROVAL_STATUS,
      SEARCH_VALUE: SEARCH_VALUE,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};
let pendingInvoiceLocal = async (
  APPROVER_ID,
  APPROVAL_STATUS,
  SEARCH_VALUE,
  OFFSET,
  LIMIT
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.pendingInvoiceLocal(
      APPROVER_ID,
      APPROVAL_STATUS,
      SEARCH_VALUE,
      OFFSET,
      LIMIT
    );
    let result = await connectionP2pORACLE.execute(query, {
      APPROVER_ID: APPROVER_ID,
      APPROVAL_STATUS: APPROVAL_STATUS,
      SEARCH_VALUE: SEARCH_VALUE,
      OFFSET: OFFSET,
      LIMIT: LIMIT,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let pendingInvoiceForeignTotal = async (
  APPROVER_ID,
  APPROVAL_STATUS,
  SEARCH_VALUE
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.pendingInvoiceForeignTotal();
    let result = await connectionP2pORACLE.execute(query, {
      APPROVER_ID: APPROVER_ID,
      APPROVAL_STATUS: APPROVAL_STATUS,
      SEARCH_VALUE: SEARCH_VALUE,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};
let pendingInvoiceForeign= async (
  APPROVER_ID,
  APPROVAL_STATUS,
  SEARCH_VALUE,
  OFFSET,
  LIMIT
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.pendingInvoiceForeign(
      APPROVER_ID,
      APPROVAL_STATUS,
      SEARCH_VALUE,
      OFFSET,
      LIMIT
    );
    let result = await connectionP2pORACLE.execute(query, {
      APPROVER_ID: APPROVER_ID,
      APPROVAL_STATUS: APPROVAL_STATUS,
      SEARCH_VALUE: SEARCH_VALUE,
      OFFSET: OFFSET,
      LIMIT: LIMIT,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let details = async (INV_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.details(INV_ID);
    let result = await connectionP2pORACLE.execute(query, { INV_ID: INV_ID });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let itemDetails = async (INV_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.itemDetails(INV_ID);
    let result = await connectionP2pORACLE.execute(query, { INV_ID: INV_ID });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let pendingBuyerTotal = async (
  APPROVER_ID,
  APPROVAL_STATUS,
  SEARCH_VALUE
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.pendingBuyerTotal();
    let result = await connectionP2pORACLE.execute(query, {
      APPROVER_ID: APPROVER_ID,
      APPROVAL_STATUS: APPROVAL_STATUS,
      SEARCH_VALUE: SEARCH_VALUE,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let pendingBuyerInvoice = async (
  APPROVER_ID,
  APPROVAL_STATUS,
  SEARCH_VALUE,
  OFFSET,
  LIMIT
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.pendingBuyerInvoice(
      APPROVER_ID,
      APPROVAL_STATUS,
      SEARCH_VALUE,
      OFFSET,
      LIMIT
    );
    let result = await connectionP2pORACLE.execute(query, {
      APPROVER_ID: APPROVER_ID,
      APPROVAL_STATUS: APPROVAL_STATUS,
      SEARCH_VALUE: SEARCH_VALUE,
      OFFSET: OFFSET,
      LIMIT: LIMIT,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};
let approveReject = async (
  INV_ID,
  ACTION_CODE,
  SUPPLIER_ID,
  APPROVER_ID,
  MODULE_NAME,
  STAGE_LEVEL,
  STAGE_ID,
  NOTE,
  V_IS_BUYER
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.approveReject(
      INV_ID,
      ACTION_CODE,
      SUPPLIER_ID,
      APPROVER_ID,
      MODULE_NAME,
      STAGE_LEVEL,
      STAGE_ID,
      NOTE,
      V_IS_BUYER
    );
    let result = await connectionP2pORACLE.execute(query, {
      INV_ID,
      ACTION_CODE: ACTION_CODE,
      SUPPLIER_ID: SUPPLIER_ID,
      APPROVER_ID: APPROVER_ID,
      MODULE_NAME: MODULE_NAME,
      STAGE_LEVEL: STAGE_LEVEL,
      STAGE_ID: STAGE_ID,
      NOTE: NOTE,
      V_IS_BUYER: V_IS_BUYER,
      MESSAGE: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 4000,
      },
      STATUS: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 10 },
      FINAL_APPROVER: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
        maxSize: 4000,
      },
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let invoiceSyncForPrepayment = async (
  APPROVAL_STATUS,
  INV_ID,
  INV_TYPE,
  PO_NUMBER,
  INVOICE_NUM,
  INVOICE_DATE,
  GL_DATE,
  PAYMENT_METHOD_CODE,
  TOTAL_AMOUNT,
  VENDOR_ID,
  VENDOR_SITE_ID,
  ORG_ID,
  DESCRIPTION
) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.invoiceSyncForPrepayment(
      APPROVAL_STATUS,
      INV_ID,
      INV_TYPE,
      PO_NUMBER,
      INVOICE_NUM,
      INVOICE_DATE,
      GL_DATE,
      PAYMENT_METHOD_CODE,
      TOTAL_AMOUNT,
      VENDOR_ID,
      VENDOR_SITE_ID,
      ORG_ID,
      DESCRIPTION
    );
    let result = await connectionP2pORACLE.execute(query, {
      APPROVAL_STATUS: APPROVAL_STATUS,
      INV_ID: INV_ID,
      INV_TYPE: INV_TYPE,
      PO_NUMBER: PO_NUMBER,
      INVOICE_NUM: INVOICE_NUM,
      INVOICE_DATE: INVOICE_DATE,
      GL_DATE: GL_DATE,
      PAYMENT_METHOD_CODE: PAYMENT_METHOD_CODE,
      TOTAL_AMOUNT: TOTAL_AMOUNT,
      VENDOR_ID: VENDOR_ID,
      VENDOR_SITE_ID: VENDOR_SITE_ID,
      ORG_ID: ORG_ID,
      DESCRIPTION: DESCRIPTION,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

let invoiceSyncForStandard = async (INV_TYPE, INV_ID, PO_NUMBER, ORG_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.invoiceSyncForStandard(
      INV_ID,
      INV_TYPE,
      PO_NUMBER,
      ORG_ID
    );
    let result = await connectionP2pORACLE.execute(query, {
      INV_TYPE: INV_TYPE,
      INV_ID: INV_ID,

      PO_NUMBER: PO_NUMBER,
      ORG_ID: ORG_ID,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};


let locationNBuyerName = async (ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.locationNBuyerName(ID);
    let result = await connectionP2pORACLE.execute(query);

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    console.log(error);
    await connectionP2pORACLE.close();
    return;
  }
};

let initiatorStatus = async (INITIATOR_ID, INV_ID) => {
  let connectionP2pORACLE = await getPool();

  try {
    let query = await queries.initiatorStatus(INITIATOR_ID, INV_ID);
    let result = await connectionP2pORACLE.execute(query, {
      INV_ID: INV_ID,
      INITIATOR_ID: INITIATOR_ID,
    });

    await connectionP2pORACLE.close();
    return result;
  } catch (error) {
    await connectionP2pORACLE.close();
    return;
  }
};

module.exports = {
  pendingInvoiceLocal,
  pendingInvoiceLocalTotal,
  details,
  approveReject,
  invoiceSyncForPrepayment,
  invoiceSyncForStandard,
  locationNBuyerName,
  pendingBuyerTotal,
  pendingBuyerInvoice,
  initiatorStatus,
  pendingInvoiceForeignTotal,
  pendingInvoiceForeign,
  itemDetails
};
