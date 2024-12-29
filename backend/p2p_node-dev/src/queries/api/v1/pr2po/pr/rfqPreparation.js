  const isEmpty = require("is-empty");
  let rfq_header_table_name = "XXP2P_RFQ_HEADER";
  let rfq_lines_table_name = "XXP2P_RFQ_LINES_ALL";
  let rfq_supplier_invite_table_name = "XXP2P_RFQ_SUPPLIER_INVITATION";
  let dbName = process.env.DATABASE_NAME;

  let rfqCreation = async (
    RFQ_SUBJECT,
    RFQ_TITLE,
    RFQ_TYPE,
    NEED_BY_DATE,
    OPEN_DATE,
    CLOSE_DATE,
    PREPARER_ID,
    PREPARER_STATUS,
    CREATED_BY
  ) => {
    let query = `
        DECLARE
        NRFQ_ID NUMBER;
        INSERT_SUCCESS BOOLEAN := FALSE;
      BEGIN
        INSERT INTO XXP2P.TEST_XXP2P_RFQ_HEADER (
            RFQ_SUBJECT,
            RFQ_TITLE,
            RFQ_TYPE,
            NEED_BY_DATE,
            OPEN_DATE,
            CLOSE_DATE,
            PREPARER_ID,
            PREPARER_STATUS,
            CREATED_BY
        ) VALUES (
            :RFQ_SUBJECT,
            :RFQ_TITLE,
            :RFQ_TYPE,
            :NEED_BY_DATE,
            :OPEN_DATE,
            :CLOSE_DATE,
            :PREPARER_ID,
            :PREPARER_STATUS,
            :CREATED_BY
        ) RETURNING RFQ_ID INTO NRFQ_ID;

        INSERT_SUCCESS := TRUE; -- Set to true if the insertion succeeds

        :MESSAGE := 'User Synced Successfully';
        :RFQ_ID := NRFQ_ID;
        :STATUS := 201;

      EXCEPTION
        WHEN OTHERS THEN
            -- Handle exception during commit
            ROLLBACK;
            :MESSAGE := 'Error during commit: ' || SQLERRM;
            :STATUS := 500; -- or another appropriate status code
            RETURN;
      END;

      -- Check if insertion was successful
      IF INSERT_SUCCESS THEN
        RETURN;
      ELSE
        :MESSAGE := 'Error during insertion';
        :STATUS := 500; -- or another appropriate status code
        RETURN;
      END IF;


        `;
    return query;
  };

  // let rfqAllList = async () => {
  //   let query = `SELECT * FROM ${dbName}.${rfq_header_table_name} order by 1`;
  //   return query;
  // };

  let rfqHeaderDetails = async (whereData) => {
    console.log(whereData);

    // Construct the query string with bind variables
    let query = `SELECT 
        *
        FROM ${dbName}.${rfq_header_table_name} WHERE RFQ_ID = :RFQ_ID
        ORDER BY 1 DESC`;
    // Return the query string
    return query;
  };

  let rfqHeaderUpdate = async (updateData, whereData) => {
    let updateClause = "";
    let whereClause = "";
    let updateParams = [];
    let whereParams = [];

    // Construct the SET clause based on the properties of updateData
    if (updateData != null && Object.keys(updateData).length > 0) {
      let updates = [];
      Object.keys(updateData).forEach((key) => {
        let value = updateData[key];
        if (
          typeof value === "string" &&
          value.match(/^\d{2}\/[a-zA-Z]{3}\/\d{4} \d{2}:\d{2}:\d{2}$/)
        ) {
          // If the value matches the date format, parse it into a Date object
          value = new Date(value);
          // Convert the parsed Date object to the desired string format
          value = `TO_DATE('${value
            .toISOString()
            .slice(0, 19)}', 'YYYY-MM-DD"T"HH24:MI:SS')`;
        } else {
          // If it's not a date, keep the original value
          value = `'${value}'`;
        }
        updates.push(`${key} = ${value}`);
        updateParams.push(value);
      });
      updateClause = "SET " + updates.join(", ");
    }

    // Construct the WHERE clause based on the properties of whereData
    if (whereData != null && Object.keys(whereData).length > 0) {
      let conditions = [];
      Object.keys(whereData).forEach((key) => {
        conditions.push(`${key} = ${whereData[key]}`); // Use NVL to handle null values
        whereParams.push(whereData[key]);
      });
      whereClause = "WHERE " + conditions.join(" AND ");
    }

    // Construct the update query string
    let query = `UPDATE ${dbName}.${rfq_header_table_name} ${updateClause} ${whereClause}`;

    console.log(query);
    console.log("Update Params:", updateParams);
    console.log("Where Params:", whereParams);

    // Here, you would execute the update query with the updateParams and whereParams
    // For example:
    // await connection.execute(query, [...updateParams, ...whereParams]);

    // Return the query string for testing purposes
    return query;
  };

  let rfqLineItemUpdate = async (updateData, whereData) => {
    let updateClause = "";
    let whereClause = "";
    let updateParams = [];
    let whereParams = [];

    // Construct the SET clause based on the properties of updateData
    if (updateData != null && Object.keys(updateData).length > 0) {
      let updates = [];
      // Object.keys(updateData).forEach((key) => {
      //   updates.push(`${key} = '${updateData[key]}'`); // Use NVL to handle null values
      //   updateParams.push(updateData[key]);
      // });
      Object.keys(updateData).forEach((key) => {
        let value = updateData[key];
        if (
          typeof value === "string" &&
          value.match(/^\d{2}\/[a-zA-Z]{3}\/\d{4} \d{2}:\d{2}:\d{2}$/)
        ) {
          // If the value matches the date format, parse it into a Date object
          value = new Date(value);
          // Convert the parsed Date object to the desired string format
          value = `TO_DATE('${value
            .toISOString()
            .slice(0, 19)}', 'YYYY-MM-DD"T"HH24:MI:SS')`;
        } else {
          // If it's not a date, keep the original value
          value = `'${value}'`;
        }
        updates.push(`${key} = ${value}`);
        updateParams.push(value);
      });
      updateClause = "SET " + updates.join(", ");
    }

    // Construct the WHERE clause based on the properties of whereData
    if (whereData != null && Object.keys(whereData).length > 0) {
      let conditions = [];
      Object.keys(whereData).forEach((key) => {
        conditions.push(`${key} = ${whereData[key]}`); // Use NVL to handle null values
        whereParams.push(whereData[key]);
      });
      whereClause = "WHERE " + conditions.join(" AND ");
    }

    // Construct the update query string
    let query = `UPDATE ${dbName}.${rfq_lines_table_name} ${updateClause} ${whereClause}`;

    console.log(query);
    console.log("Update Params:", updateParams);
    console.log("Where Params:", whereParams);

    // Here, you would execute the update query with the updateParams and whereParams
    // For example:
    // await connection.execute(query, [...updateParams, ...whereParams]);

    // Return the query string for testing purposes
    return query;
  };

  let rfqDetails = async (whereData, USER_ID, offset, limit) => {
    console.log(whereData);

    let whereClause = "";
    let queryParams = [];

    // Construct the WHERE clause based on the properties of whereData
    if (whereData != null && Object.keys(whereData).length > 0) {
      let conditions = [];
      Object.keys(whereData).forEach((key) => {
        // Specify the table alias for the column
        conditions.push(
          `RFQ_LINES.${key} = NVL('${whereData[key]}', RFQ_LINES.${key})`
        ); // Use NVL to handle null values
        queryParams.push(whereData[key]);
      });
      whereClause = "WHERE " + conditions.join(" AND ");
    }

    // Construct the query string with join and bind variables
    let query = `
          SELECT 
 RFQ_LINES.RFQ_LINE_ID,
  RFQ_LINES.RFQ_ID,
  RFQ_LINES.REQUISITION_HEADER_ID,
  RFQ_LINES.REQUISITION_LINE_ID,
  RFQ_LINES.PR_NUMBER,
  RFQ_LINES.LINE_NUM,
  RFQ_LINES.LINE_TYPE_ID,
  RFQ_LINES.ITEM_CODE,
  RFQ_LINES.ITEM_DESCRIPTION,
  RFQ_LINES.ITEM_SPECIFICATION,
  RFQ_LINES.WARRANTY_DETAILS as BUYER_WARRANTY_DETAILS,
  RFQ_LINES.PACKING_TYPE,
  RFQ_LINES.PROJECT_NAME,
  RFQ_LINES.EXPECTED_QUANTITY,
  RFQ_LINES.EXPECTED_BRAND_NAME,
  RFQ_LINES.EXPECTED_ORIGIN,
  RFQ_LINES.LCM_ENABLE_FLAG,
  RFQ_LINES.UNIT_MEAS_LOOKUP_CODE,
  RFQ_LINES.NEED_BY_DATE,
  RFQ_LINES.ORG_ID,
  RFQ_LINES.ATTRIBUTE_CATEGORY,
  RFQ_LINES.PR_FROM_DFF,
  RFQ_LINES.AUTHORIZATION_STATUS,
  RFQ_LINES.NOTE_TO_SUPPLIER,
  RFQ_LINES.WARRANTY_ASK_BY_BUYER,
  RFQ_LINES.BUYER_VAT_APPLICABLE,
  RFQ_LINES.DELIVER_TO_LOCATION_ID,
  RFQ_LINES.DESTINATION_ORGANIZATION_ID,
  RFQ_LINES.CS_STATUS,
  RFQ_LINES.CREATION_DATE,
  RFQ_LINES.CREATED_BY,
  RFQ_LINES.LAST_UPDATED_BY,
  RFQ_LINES.LAST_UPDATE_DATE,
  RFQ_LINES.BUYER_FILE_ORG_NAME,
  RFQ_LINES.BUYER_FILE_NAME,
  RFQ_LINES.ITEM_ID,
  RFQ_LINES.RATE_TYPE,
  RFQ_LINES.RATE_DATE,
  RFQ_LINES.CONVERSION_RATE,
  RFQ_LINES.LINE_TYPE,
  RFQ_LINES.MATCH_OPTION,
  RFQ_LINES.PR_LINE_NUM,
  RFQ_LINES.PR_APPROVED_DATE,
  RFQ_LINES.LINE_STATUS as RFQ_LINE_STATUS,
  
  
   SUPPLIER_QUOTATION.QUOT_LINE_ID,
  SUPPLIER_QUOTATION.RFQ_LINE_ID,
  SUPPLIER_QUOTATION.RFQ_ID,
  SUPPLIER_QUOTATION.USER_ID,
  SUPPLIER_QUOTATION.WARRANTY_BY_SUPPLIER,
  SUPPLIER_QUOTATION.SUPPLIER_VAT_APPLICABLE,
  SUPPLIER_QUOTATION.UNIT_PRICE,
  SUPPLIER_QUOTATION.OFFERED_QUANTITY,
  SUPPLIER_QUOTATION.PROMISE_DATE,
  SUPPLIER_QUOTATION.SUP_FILE_ORG_NAME,
  SUPPLIER_QUOTATION.SUP_FILE_NAME,
  SUPPLIER_QUOTATION.CREATION_DATE,
  SUPPLIER_QUOTATION.CREATED_BY,
  SUPPLIER_QUOTATION.LAST_UPDATED_BY,
  SUPPLIER_QUOTATION.LAST_UPDATE_DATE,
  SUPPLIER_QUOTATION.AVAILABLE_BRAND_NAME,
  SUPPLIER_QUOTATION.AVAILABLE_ORIGIN,
  SUPPLIER_QUOTATION.AVAILABLE_SPECS,
  SUPPLIER_QUOTATION.TOLERANCE,
  SUPPLIER_QUOTATION.TOTAL_LINE_AMOUNT,
  SUPPLIER_QUOTATION.VAT_TYPE,
  SUPPLIER_QUOTATION.VAT_AMOUNT,
  SUPPLIER_QUOTATION.LINE_STATUS as QUOT_LINE_STATUS,
  SUPPLIER_QUOTATION.FREIGHT_CHARGE,
  SUPPLIER_QUOTATION.WARRANTY_DETAILS as SUPPLIER_WARRANTY_DETAILS,
  SUPPLIER_QUOTATION.COUNTRY_CODE,
  SUPPLIER_QUOTATION.COUNTRY_NAME
          FROM ${dbName}.${rfq_lines_table_name} RFQ_LINES
          LEFT JOIN ${dbName}.XXP2P_RFQ_SUPPLIER_QUOTATION SUPPLIER_QUOTATION
          ON RFQ_LINES.RFQ_LINE_ID = SUPPLIER_QUOTATION.RFQ_LINE_ID
          AND RFQ_LINES.RFQ_ID = SUPPLIER_QUOTATION.RFQ_ID
          AND SUPPLIER_QUOTATION.USER_ID = ${USER_ID}
          AND RFQ_LINES.LINE_STATUS = 'Y'
          ${whereClause}
          ORDER BY RFQ_LINES.RFQ_LINE_ID DESC`;

    // Add OFFSET and LIMIT if provided in whereData
    if (offset != null && limit != null) {
      query = query + ` OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
    }

    console.log(query);
    // Return the query string
    return query;
  };

  const rfqAllList  = async (whereData) => {
    const query = `
        SELECT 
          RH.*,
          (SELECT 
      HOU.NAME
  FROM 
      HR_OPERATING_UNITS HOU
  WHERE HOU.ORGANIZATION_ID = RH.ORG_ID) AS ORG_NAME, 
          (SELECT FULL_NAME
          FROM ${dbName}.XXP2P_USER  
          WHERE USER_ID = RH.CREATED_BY) AS BUYER_NAME
        FROM ${dbName}.${rfq_header_table_name} RH 
        WHERE 
          (:FROM_DATE IS NULL OR TRUNC(RH.CLOSE_DATE) >= TO_DATE(:FROM_DATE, 'YYYY-MM-DD'))
          AND (:TO_DATE IS NULL OR TRUNC(RH.CLOSE_DATE) <= TO_DATE(:TO_DATE, 'YYYY-MM-DD'))
          AND (:SEARCH_FIELD IS NULL 
              OR UPPER(RH.RFQ_SUBJECT) = UPPER(:SEARCH_FIELD)
              OR UPPER(RH.RFQ_TITLE) LIKE '%' || UPPER(:SEARCH_FIELD) || '%'
              OR TO_CHAR(RH.RFQ_ID) = :SEARCH_FIELD)
        AND RH.RFQ_STATUS = :RFQ_STATUS
        AND RH.CREATED_BY = NVL(:CREATED_BY,RH.CREATED_BY)
              ORDER BY RH.RFQ_ID DESC
        OFFSET :OFFSET ROWS FETCH NEXT :LIMIT ROWS ONLY
      `;

    const params = {
      FROM_DATE: whereData.FROM_DATE || null,
      TO_DATE: whereData.TO_DATE || null,
      SEARCH_FIELD: whereData.SEARCH_FIELD || null,
      RFQ_STATUS: whereData.RFQ_STATUS || null,
      CREATED_BY: whereData.CREATED_BY || null,
      OFFSET: whereData.OFFSET || 0, // Default to 0 if not provided
      LIMIT: whereData.LIMIT || 10, // Default to 10 if not provided
    };

    return { query, params };
  };

  const rfqAllListTotal = (whereData) => {
    const query = `
        SELECT COUNT(RFQ_ID) AS TOTAL 
        FROM ${dbName}.${rfq_header_table_name} RH
        WHERE 
          (:FROM_DATE IS NULL OR TRUNC(RH.CLOSE_DATE) >= TO_DATE(:FROM_DATE, 'YYYY-MM-DD'))
          AND (:TO_DATE IS NULL OR TRUNC(RH.CLOSE_DATE) <= TO_DATE(:TO_DATE, 'YYYY-MM-DD'))
          AND (:SEARCH_FIELD IS NULL 
              OR UPPER(RH.RFQ_SUBJECT) = UPPER(:SEARCH_FIELD)
              OR UPPER(RH.RFQ_TITLE) LIKE '%' || UPPER(:SEARCH_FIELD) || '%'
              OR TO_CHAR(RH.RFQ_ID) = :SEARCH_FIELD)
          AND RH.RFQ_STATUS = :RFQ_STATUS
          AND RH.CREATED_BY = NVL(:CREATED_BY,RH.CREATED_BY)
      `;

    const params = {
      FROM_DATE: whereData.FROM_DATE || null,
      TO_DATE: whereData.TO_DATE || null,
      SEARCH_FIELD: whereData.SEARCH_FIELD || null,
      RFQ_STATUS: whereData.RFQ_STATUS || null,
      CREATED_BY: whereData.CREATED_BY || null,
    };

    return { query, params };
  };

  let rfqAllDetailsTotal = async (whereData) => {
    console.log(whereData);
    let whereClause = "";
    let queryParams = [];

    // Construct the WHERE clause based on the properties of whereData
    if (whereData != null && Object.keys(whereData).length > 0) {
      let conditions = [];
      Object.keys(whereData).forEach((key) => {
        conditions.push(`${key} = NVL('${whereData[key]}', ${key})`); // Use NVL to handle null values
        queryParams.push(whereData[key]);
      });
      whereClause = "WHERE " + conditions.join(" AND ");
    }

    // Construct the query string with bind variables
    let query = `SELECT COUNT(RFQ_ID) AS TOTAL FROM ${dbName}.${rfq_lines_table_name} ${whereClause} ORDER BY 1 DESC`;

    console.log(query);
    // Return the query string
    return query;
  };

  let rfqSupplierList = async (whereData, offset, limit) => {
    console.log(whereData);
    let whereClause = "";
    let queryParams = [];

    // Construct the WHERE clause based on the properties of whereData
    if (whereData != null && Object.keys(whereData).length > 0) {
      let conditions = [];
      Object.keys(whereData).forEach((key) => {
        conditions.push(`rinv.${key} = NVL('${whereData[key]}', rinv.${key})`); // Use NVL to handle null values
        queryParams.push(whereData[key]);
      });
      whereClause = "WHERE " + conditions.join(" AND ");
    }

    // Construct the query string with bind variables
    let query = `SELECT US.SUPPLIER_ID AS REGISTRATION_ID,rinv.* 
    FROM ${dbName}.${rfq_supplier_invite_table_name} rinv 
    LEFT JOIN ${dbName}.${dbName}_USER US ON US.USER_ID = rinv.USER_ID
    ${whereClause} ORDER BY 1 DESC`;

    // Add OFFSET and LIMIT if provided in whereData
    if (offset != null && limit != null) {
      query = query + ` OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
    }

    console.log(query);
    // Return the query string
    return query;
  };

  let rfqAllSupplierListTotal = async (whereData) => {
    console.log(whereData);
    let whereClause = "";
    let queryParams = [];

    // Construct the WHERE clause based on the properties of whereData
    if (whereData != null && Object.keys(whereData).length > 0) {
      let conditions = [];
      Object.keys(whereData).forEach((key) => {
        conditions.push(`${key} = NVL('${whereData[key]}', ${key})`); // Use NVL to handle null values
        queryParams.push(whereData[key]);
      });
      whereClause = "WHERE " + conditions.join(" AND ");
    }

    // Construct the query string with bind variables
    let query = `SELECT COUNT(RFQ_ID) AS TOTAL FROM ${dbName}.${rfq_supplier_invite_table_name} ${whereClause} ORDER BY 1 DESC`;

    console.log(query);
    // Return the query string
    return query;
  };

  let addNewRFQHeader = async (data = {}) => {
    let keys = Object.keys(data);

    let query = `insert into ${dbName}.${rfq_header_table_name} (` + keys[0];
    let valueString = " ( :1";

    for (let i = 1; i < keys.length; i++) {
      query += `, ` + keys[i];
      valueString += `, :${i + 1}`;
    }

    query =
      query +
      `) VALUES ` +
      valueString +
      `) RETURNING RFQ_ID INTO :${keys.length + 1}`;
    //console.log(query);
    return query;
  };

  let addNewRFQLines = async (data = {}) => {
    let keys = Object.keys(data);

    let query = `insert into ${dbName}.${rfq_lines_table_name} (` + keys[0];
    let valueString = " ( :1";

    for (let i = 1; i < keys.length; i++) {
      query += `, ` + keys[i];
      valueString += `, :${i + 1}`;
    }

    query =
      query +
      `) VALUES ` +
      valueString +
      `) RETURNING RFQ_ID INTO :${keys.length + 1}`;
    //console.log(query);
    return query;
  };

  let addNewRFQInviteSuppliers = async (data = {}) => {
    let keys = Object.keys(data);

    let query =
      `insert into ${dbName}.${rfq_supplier_invite_table_name} (` + keys[0];
    let valueString = " ( :1";

    for (let i = 1; i < keys.length; i++) {
      query += `, ` + keys[i];
      valueString += `, :${i + 1}`;
    }

    query =
      query +
      `) VALUES ` +
      valueString +
      `) RETURNING RFQ_ID INTO :${keys.length + 1}`;
    //console.log(query);
    return query;
  };

  // let employeeNameById = async (whereData) => {
  //   let PERSON_ID = whereData.PERSON_ID;
  //   let query = `select FULL_NAME
  //   from HR.PER_ALL_PEOPLE_F
  //   where  PERSON_ID = :PERSON_ID`;
  //   return query;
  // };

  let employeeNameById = async (whereData) => {
    let PERSON_ID = whereData.PERSON_ID;
    let query = `select FULL_NAME
        from  XXP2P.XXP2P_USER  
        where  USER_ID = :PERSON_ID`;
    return query;
  };

  let locationNameById = async (ID) => {
    let query = `select LOCATION_ID,LOCATION_CODE
        from hr_locations_v
        where  LOCATION_ID = :ID`;
    return query;
  };

  let categoryList = async (whereData) => {
    let ORG_ID = whereData.ORG_ID;
    let query = `select 
        VENDOR_LIST_HEADER_ID,
        VENDOR_LIST_NAME,
        DESCRIPTION 
        from PO.PO_VENDOR_LIST_HEADERS where ORG_ID = :ORG_ID ORDER BY 1`;

    return query;
  };

  let ouWiseStock = async (ORG_ID, ITEM_ID) => {
    let query = 
    `
     select 
                moq.inventory_item_id,
                ood.organization_code,
                ood.organization_name,
                sum(moq.transaction_quantity) as quantity
        from mtl_onhand_quantities moq , org_organization_definitions ood
       where 1=1
         and moq.organization_id=ood.organization_id
         and ood.operating_unit=:ORG_ID 
         and moq.inventory_item_id = :ITEM_ID
         group by moq.inventory_item_id,ood.organization_code,ood.organization_name
    `;

    return query;
  };

  let inventoryStock = async (ORG_ID, ITEM_ID) => {
    let query = `
        select apps.xx_onhand_quantity (:ITEM_ID,:ORG_ID) On_hand from dual
        `;

    return query;
  };

  let locationList = async () => {
    let query = `select LOCATION_ID,LOCATION_CODE
        from hr_locations_v
        where STYLE='BD_GLB'`;

    return query;
  };

  let deleteLineItem = async (RFQ_LINE_ID) => {
    let query = `UPDATE XXP2P.XXP2P_RFQ_LINES_ALL SET LINE_STATUS = 'C'
        where RFQ_LINE_ID = :RFQ_LINE_ID`;

    return query;
  };

  let invoiceTypeList = async () => {
    let query = `select LOOKUP_CODE,MEANING,DESCRIPTION from FND_LOOKUP_VALUES_VL  
        where 1=1
        and LOOKUP_TYPE='INVOICE TYPE'
        and ENABLED_FLAG='Y'
        and LOOKUP_CODE in('STANDARD','PREPAYMENT')`;

    return query;
  };

  let freightTermsList = async () => {
    let query = `select LOOKUP_CODE,MEANING,DESCRIPTION from FND_LOOKUP_VALUES_VL  
        where 1=1
        and LOOKUP_TYPE='FREIGHT_TERMS'
        and ENABLED_FLAG='Y'`;

    return query;
  };

  let paymentTermsList = async () => {
    let query = `Select TERM_ID,NAME,DESCRIPTION from ap_terms_vl
        where ENABLED_FLAG='Y'`;

    return query;
  };
  let generalTermsList = async () => {
    let query = `select fd.DOCUMENT_ID,fd.MEDIA_ID,fd.DESCRIPTION,fd.CATEGORY_DESCRIPTION,fd.DATATYPE_NAME ,DBMS_LOB.SUBSTR (ftext.LONG_TEXT, 3996, 1) DATA_VIEW 
        FROM FND_DOCUMENTS_VL fd,FND_DOCUMENTS_LONG_TEXT ftext
        where fd.MEDIA_ID=ftext.MEDIA_ID
        and fd.DESCRIPTION ='SSGL General PO Terms'`;

    return query;
  };

  let supplierList = async (whereData, OFFSET, LIMIT) => {
    let SEARCH_FIELD = whereData.SEARCH_FIELD;
    let ORG_ID = whereData.ORG_ID;
    let query = `
        WITH user_data AS (
        SELECT
            US.USER_ID,
            BSC.ORGANIZATION_NAME AS SUPPLIER_NAME,
            BSC.VENDOR_TYPE AS SUPPLIER_TYPE,
            US.SUPPLIER_ID AS REGISTRATION_ID,
            US.VENDOR_ID,
            US.MOBILE_NUMBER,
            US.EMAIL_ADDRESS,
            RD.TRADE_OR_EXPORT_LICENSE_END_DATE,
            RD.TAX_RTN_ASSMNT_YEAR,
            RD.PROFILE_PIC1_FILE_NAME,
            RD.PROFILE_PIC2_FILE_NAME,
            COUNT(DISTINCT(CSALL.PO_HEADER_ID)) AS TOTAL_PO, 
            MAX(CSALL.PO_DATE) AS PO_DATE
        FROM
            XXP2P.XXP2P_USER US
        LEFT JOIN  
            XXP2P.XXP2P_SUPPLIER_BSC_INFO BSC ON BSC.USER_ID = US.USER_ID
        LEFT JOIN 
            XXP2P.XXP2P_SUPPLIER_REGISTRATION_DOCUMENTS RD ON RD.USER_ID = US.USER_ID
        LEFT JOIN 
            XXP2P.XXP2P_CS_LINES_ALL CSALL ON CSALL.USER_ID = US.USER_ID 
        WHERE
            US.APPROVAL_STATUS = 'APPROVED'
            AND US.USER_ACTIVE_STATUS = 1
            AND US.IS_REG_COMPLETE = 1
            AND US.SUPPLIER_ID IS NOT NULL
            AND US.USER_TYPE = 'Supplier'
            AND EXISTS (
                SELECT 1
                FROM XXP2P.XXP2P_SUPPLIER_SITES_OU SOU
                WHERE SOU.USER_ID = US.USER_ID
                AND SOU.ORGANIZATION_ID = :ORG_ID
                AND SOU.VENDOR_SITE_ID is not null
                AND SOU.ACTIVE_STATUS = 'ACTIVE'
            )
            AND (
                :SEARCH_FIELD IS NULL
                OR LOWER(BSC.ORGANIZATION_NAME) LIKE '%' || LOWER(:SEARCH_FIELD) || '%'
                OR LOWER(TO_CHAR(US.SUPPLIER_ID)) LIKE '%' || LOWER(:SEARCH_FIELD) || '%'
                OR LOWER(US.EMAIL_ADDRESS) LIKE '%' || LOWER(:SEARCH_FIELD) || '%'
            )
        GROUP BY 
            US.USER_ID,
            BSC.ORGANIZATION_NAME,
            BSC.VENDOR_TYPE,
            US.SUPPLIER_ID,
            US.VENDOR_ID,
            US.MOBILE_NUMBER,
            US.EMAIL_ADDRESS,
            RD.TRADE_OR_EXPORT_LICENSE_END_DATE,
            RD.TAX_RTN_ASSMNT_YEAR,
            RD.PROFILE_PIC1_FILE_NAME,
            RD.PROFILE_PIC2_FILE_NAME
    ),
    latest_po AS (
        SELECT 
            USER_ID,
            PO_NUMBER
        FROM (
            SELECT 
                CSALL.USER_ID,
                CSALL.PO_NUMBER,
                ROW_NUMBER() OVER (PARTITION BY CSALL.USER_ID ORDER BY CSALL.PO_DATE DESC NULLS LAST) AS rn
            FROM XXP2P.XXP2P_CS_LINES_ALL CSALL
        )
        WHERE rn = 1
    )
    SELECT
        ud.*,
        lp.PO_NUMBER
    FROM
        user_data ud
    LEFT JOIN 
        latest_po lp ON ud.USER_ID = lp.USER_ID
    ORDER BY 
        TRIM(ud.SUPPLIER_NAME) ASC
          OFFSET ${OFFSET} ROWS FETCH NEXT ${LIMIT} ROWS ONLY
      `;

    return query;
  };

  let supplierListTotal = async (whereData) => {
    console.log(whereData);
    let SEARCH_FIELD = whereData.SEARCH_FIELD;
    let ORG_ID = whereData.ORG_ID;
    console.log(SEARCH_FIELD);
    let query = `WITH user_data AS (
        SELECT DISTINCT
            US.USER_ID
        FROM
            XXP2P.XXP2P_USER US
        LEFT JOIN  
            XXP2P.XXP2P_SUPPLIER_BSC_INFO BSC ON BSC.USER_ID = US.USER_ID
        LEFT JOIN 
            XXP2P.XXP2P_SUPPLIER_REGISTRATION_DOCUMENTS RD ON RD.USER_ID = US.USER_ID
        LEFT JOIN 
            XXP2P.XXP2P_CS_LINES_ALL CSALL ON CSALL.USER_ID = US.USER_ID 
        WHERE
            US.APPROVAL_STATUS = 'APPROVED'
            AND US.USER_ACTIVE_STATUS = 1
            AND US.IS_REG_COMPLETE = 1
            AND US.SUPPLIER_ID IS NOT NULL
            AND US.USER_TYPE = 'Supplier'
            AND EXISTS (
                SELECT 1
                FROM XXP2P.XXP2P_SUPPLIER_SITES_OU SOU
                WHERE SOU.USER_ID = US.USER_ID
                AND SOU.ORGANIZATION_ID = :ORG_ID
            )
            AND (
                :SEARCH_FIELD IS NULL
                OR LOWER(BSC.ORGANIZATION_NAME) LIKE '%' || LOWER(:SEARCH_FIELD) || '%'
                OR LOWER(TO_CHAR(US.SUPPLIER_ID)) LIKE '%' || LOWER(:SEARCH_FIELD) || '%'
                OR LOWER(US.EMAIL_ADDRESS) LIKE '%' || LOWER(:SEARCH_FIELD) || '%'
            )
    )
    SELECT COUNT(DISTINCT USER_ID) AS TOTAL
    FROM user_data`;
    /*`
      SELECT
      US.USER_ID,
      BSC.ORGANIZATION_NAME AS SUPPLIER_NAME,
      US.SUPPLIER_ID AS REGISTRATION_ID,
      US.BUYER_ID,
      US.MOBILE_NUMBER,
      US.EMAIL_ADDRESS,
      RD.TRADE_OR_EXPORT_LICENSE_END_DATE,
      RD.TAX_RTN_ASSMNT_YEAR
      FROM
      XXP2P.XXP2P_USER US
      LEFT JOIN  XXP2P.XXP2P_SUPPLIER_BSC_INFO BSC 
      ON   BSC.USER_ID =   US.USER_ID
      LEFT JOIN XXP2P.XXP2P_SUPPLIER_REGISTRATION_DOCUMENTS RD
      ON RD.USER_ID =   US.USER_ID
      WHERE
      US.APPROVAL_STATUS= 'APPROVED'
      AND US.USER_ACTIVE_STATUS = 1
      AND US.USER_TYPE = 'Supplier'
      AND (BSC.ORGANIZATION_NAME = NVL(TO_CHAR(:SEARCH_FIELD), BSC.ORGANIZATION_NAME)
          OR TO_CHAR(US.SUPPLIER_ID) = NVL(TO_CHAR(:SEARCH_FIELD), US.SUPPLIER_ID)
          OR US.EMAIL_ADDRESS = NVL(TO_CHAR(:SEARCH_FIELD), US.EMAIL_ADDRESS)
          )`;*/

    return query;
  };

  let supplierNumberFromEBS = async (whereData, OFFSET, LIMIT) => {
    let SEARCH_FIELD = whereData.SEARCH_FIELD;
    let ORG_ID = whereData.ORG_ID;
    let VENDOR_LIST_HEADER_ID = whereData.VENDOR_LIST_HEADER_ID;
    let query = `SELECT
        US.USER_ID,
        BSC.ORGANIZATION_NAME AS SUPPLIER_NAME,
        BSC.VENDOR_TYPE AS SUPPLIER_TYPE,
        US.SUPPLIER_ID AS REGISTRATION_ID,
        US.VENDOR_ID,
        US.MOBILE_NUMBER,
        US.EMAIL_ADDRESS,
        RD.TRADE_OR_EXPORT_LICENSE_END_DATE,
        RD.TAX_RTN_ASSMNT_YEAR,
        RD.PROFILE_PIC1_FILE_NAME,
        RD.PROFILE_PIC2_FILE_NAME,
        COUNT(DISTINCT(CSALL.PO_HEADER_ID)) AS TOTAL_PO, 
        MAX(CSALL.PO_NUMBER) AS PO_NUMBER, 
        MAX(CSALL.PO_DATE) AS PO_DATE
    FROM
        XXP2P.XXP2P_USER US
    LEFT JOIN  
        XXP2P.XXP2P_SUPPLIER_BSC_INFO BSC ON BSC.USER_ID = US.USER_ID
    LEFT JOIN 
        XXP2P.XXP2P_SUPPLIER_REGISTRATION_DOCUMENTS RD ON RD.USER_ID = US.USER_ID
    LEFT JOIN 
        XXP2P.XXP2P_SUPPLIER_SITES_OU SOU ON SOU.ORGANIZATION_ID = :ORG_ID AND SOU.USER_ID = US.USER_ID
    LEFT JOIN 
        XXP2P.XXP2P_CS_LINES_ALL CSALL ON CSALL.USER_ID = US.USER_ID
    INNER JOIN 
        (SELECT DISTINCT
            APS.SEGMENT1 as SUPPLIER_ID
        FROM
            PO.PO_VENDOR_LIST_ENTRIES POVLE,
            PO.PO_VENDOR_LIST_HEADERS POVLH,
            HR_OPERATING_UNITS HOU,
            AP_SUPPLIERS APS
        WHERE
            POVLE.VENDOR_LIST_HEADER_ID = POVLH.VENDOR_LIST_HEADER_ID
            AND HOU.ORGANIZATION_ID = POVLH.ORG_ID
            AND POVLE.VENDOR_ID = APS.VENDOR_ID
            AND POVLE.VENDOR_LIST_HEADER_ID = :VENDOR_LIST_HEADER_ID
        ) APS_FILTER ON US.SUPPLIER_ID = APS_FILTER.SUPPLIER_ID
    WHERE
        US.APPROVAL_STATUS = 'APPROVED'
        AND US.USER_ACTIVE_STATUS = 1
        AND US.IS_REG_COMPLETE = 1
        AND US.SUPPLIER_ID IS NOT NULL
        AND US.USER_TYPE = 'Supplier'
        AND (
            LOWER(BSC.ORGANIZATION_NAME) LIKE '%' || LOWER(NVL(:SEARCH_FIELD, BSC.ORGANIZATION_NAME)) || '%'
            OR LOWER(TO_CHAR(US.SUPPLIER_ID)) LIKE '%' || LOWER(NVL(:SEARCH_FIELD, TO_CHAR(US.SUPPLIER_ID))) || '%'
            OR LOWER(US.EMAIL_ADDRESS) LIKE '%' || LOWER(NVL(:SEARCH_FIELD, US.EMAIL_ADDRESS)) || '%'
        )
    GROUP BY 
        US.USER_ID,
        BSC.ORGANIZATION_NAME,
        US.SUPPLIER_ID,
        US.VENDOR_ID,
        US.MOBILE_NUMBER,
        US.EMAIL_ADDRESS,
        RD.TRADE_OR_EXPORT_LICENSE_END_DATE,
        RD.TAX_RTN_ASSMNT_YEAR,
        RD.PROFILE_PIC1_FILE_NAME,
        RD.PROFILE_PIC2_FILE_NAME,
        BSC.VENDOR_TYPE
    ORDER BY 
        TRIM(BSC.ORGANIZATION_NAME) ASC
      OFFSET ${OFFSET} ROWS FETCH NEXT ${LIMIT} ROWS ONLY
    `;
    /* `
        SELECT DISTINCT
            APS.SEGMENT1 as SUPPLIER_NUMBER,
            APS.VENDOR_NAME
            
        FROM PO.PO_VENDOR_LIST_ENTRIES  POVLE,
            po.po_vendor_list_headers POVLH,
            HR_OPERATING_UNITS HOU,
            AP_SUPPLIERS               APS
      WHERE POVLE.VENDOR_LIST_HEADER_ID = POVLH.VENDOR_LIST_HEADER_ID 
            AND HOU.ORGANIZATION_ID = POVLH.ORG_ID 
            AND POVLE.VENDOR_ID = APS.VENDOR_ID
            and POVLE.VENDOR_LIST_HEADER_ID = ${VENDOR_LIST_HEADER_ID}
      ORDER BY 1`;*/
    return query;
  };

  let supplierNumberFromEBSCount = async (whereData) => {
    let SEARCH_FIELD = whereData.SEARCH_FIELD;
    let ORG_ID = whereData.ORG_ID;
    let VENDOR_LIST_HEADER_ID = whereData.VENDOR_LIST_HEADER_ID;
    let query = `SELECT COUNT(*) AS total
    FROM (
        SELECT
            US.USER_ID
        FROM
            XXP2P.XXP2P_USER US
        LEFT JOIN  
            XXP2P.XXP2P_SUPPLIER_BSC_INFO BSC ON BSC.USER_ID = US.USER_ID
        LEFT JOIN 
            XXP2P.XXP2P_SUPPLIER_REGISTRATION_DOCUMENTS RD ON RD.USER_ID = US.USER_ID
        LEFT JOIN 
            XXP2P.XXP2P_SUPPLIER_SITES_OU SOU ON SOU.ORGANIZATION_ID = :ORG_ID AND SOU.USER_ID = US.USER_ID
        LEFT JOIN 
            XXP2P.XXP2P_CS_LINES_ALL CSALL ON CSALL.USER_ID = US.USER_ID
        INNER JOIN 
            (SELECT DISTINCT
                APS.SEGMENT1 as SUPPLIER_ID
            FROM
                PO.PO_VENDOR_LIST_ENTRIES POVLE,
                PO.PO_VENDOR_LIST_HEADERS POVLH,
                HR_OPERATING_UNITS HOU,
                AP_SUPPLIERS APS
            WHERE
                POVLE.VENDOR_LIST_HEADER_ID = POVLH.VENDOR_LIST_HEADER_ID
                AND HOU.ORGANIZATION_ID = POVLH.ORG_ID
                AND POVLE.VENDOR_ID = APS.VENDOR_ID
                AND POVLE.VENDOR_LIST_HEADER_ID = :VENDOR_LIST_HEADER_ID
            ) APS_FILTER ON US.SUPPLIER_ID = APS_FILTER.SUPPLIER_ID
        WHERE
            US.APPROVAL_STATUS = 'APPROVED'
            AND US.USER_ACTIVE_STATUS = 1
            AND US.IS_REG_COMPLETE = 1
            AND US.SUPPLIER_ID IS NOT NULL
            AND US.USER_TYPE = 'Supplier'
            AND (
                LOWER(BSC.ORGANIZATION_NAME) LIKE '%' || LOWER(NVL(:SEARCH_FIELD, BSC.ORGANIZATION_NAME)) || '%'
                OR LOWER(TO_CHAR(US.SUPPLIER_ID)) LIKE '%' || LOWER(NVL(:SEARCH_FIELD, TO_CHAR(US.SUPPLIER_ID))) || '%'
                OR LOWER(US.EMAIL_ADDRESS) LIKE '%' || LOWER(NVL(:SEARCH_FIELD, US.EMAIL_ADDRESS)) || '%'
            )
        GROUP BY 
            US.USER_ID
    )


    `;

    return query;
  };
  let orgWiseSupplierSite = async (ORG_ID, USER_ID) => {
    let query = `Select 
      ST.ID AS SITE_ID,
      ST.ADDRESS_LINE1,
      ST.EMAIL,
      sou.VENDOR_SITE_ID,
      st.PRIMARY_SITE
      from 
      xxp2p.xxp2p_supplier_sites_ou sou
      LEFT JOIN xxp2p.xxp2p_supplier_site ST ON ST.ID = sou.SITE_ID
      where sou.ORGANIZATION_ID = ${ORG_ID}
      AND sou.USER_ID = ${USER_ID}
      and sou.ACTIVE_STATUS = 'ACTIVE'`;

    return query;
  };

  let supplierContact = async (USER_ID) => {
    let query = `select id,name,MOB_NUMBER_1,EMAIL,VENDOR_CONTACT_ID 
      from xxp2p.xxp2p_supplier_contact_person_dtls 
    where user_id = ${USER_ID} 
    and ACTIVE_STATUS IN('APPROVED','ACTIVE') 
      
      `;

    return query;
  };

  let getDataByWhereCondition = async (
    data = {},
    orderBy = {},
    limit,
    offset,
    columnList = []
  ) => {
    let keys = Object.keys(data);
    let columns = " * ";
    let flag = 2;

    try {
      if (Array.isArray(columnList) && !isEmpty(columnList)) {
        columns = columnList.join(",");
      }
    } catch (error) {
      columns = " * ";
    }

    let query = `Select ${columns} from ${dbName}.${rfq_header_table_name} `;

    if (keys.length > 0) {
      if (Array.isArray(data[keys[0]])) {
        query += ` where ${keys[0]} BETWEEN :1 and :2`;
        flag = 3;
      } else if (
        typeof data[keys[0]] === "object" &&
        !Array.isArray(data[keys[0]]) &&
        data[keys[0]] !== null
      ) {
        let key2 = Object.keys(data[keys[0]]);

        for (let indexKey = 0; indexKey < key2.length; indexKey++) {
          let tempSubKeyValue = data[keys[0]][key2[indexKey]];
          if (
            key2[indexKey].toUpperCase() === "OR" &&
            Array.isArray(tempSubKeyValue)
          ) {
            query += ` where ( ${keys[0]} = :1`;
            for (
              let indexValue = 1;
              indexValue < tempSubKeyValue.length;
              indexValue++
            ) {
              query += ` or ` + keys[0] + ` = :1`;
            }
            query += ` ) `;
          } else if (key2[indexKey].toUpperCase() === "OR") {
            query +=
              ` where ${key2[indexKey].toLowerCase()} ` + keys[0] + ` = :1`;
          } else if (key2[indexKey].toUpperCase() === "LIKE") {
            query += ` where ${keys[0]} like :1`;
          } else if (["IN", "NOT IN"].includes(key2[indexKey].toUpperCase())) {
            query += ` where ${keys[0]}  ${key2[indexKey].toUpperCase()} ( :1) `;
          } else if (["IN QUERY"].includes(key2[indexKey].toUpperCase())) {
            query += ` where  ${keys[0]}  IN ( ${
              data[keys[0]][key2[indexKey]]
            } ) `;
          } else if (["NOT IN QUERY"].includes(key2[indexKey].toUpperCase())) {
            query += ` where  ${keys[0]}  NOT IN ( ${
              data[keys[0]][key2[indexKey]]
            } ) `;
          } else if ("GTE" == key2[indexKey].toUpperCase()) {
            query += ` where  ` + keys[0] + ` >= :1`;
          } else if ("GT" == key2[indexKey].toUpperCase()) {
            query += ` where ` + keys[0] + ` > :1`;
          } else if ("LTE" == key2[indexKey].toUpperCase()) {
            query += ` where ` + keys[0] + ` <= :1`;
          } else if ("LT" == key2[indexKey].toUpperCase()) {
            query += ` where ` + keys[0] + ` < :1`;
          } else if ("NOT EQ" == key2[indexKey].toUpperCase()) {
            query += ` where ` + keys[0] + ` != :1`;
          }
        }
      } else {
        query += ` where ${keys[0]} = :1`;
      }

      for (let i = 1; i < keys.length; i++, flag++) {
        if (Array.isArray(data[keys[i]])) {
          query += ` and ` + keys[i] + `  BETWEEN  :${flag} and :${flag}`;
          flag++;
        } else if (
          typeof data[keys[i]] === "object" &&
          !Array.isArray(data[keys[i]]) &&
          data[keys[i]] !== null
        ) {
          let key2 = Object.keys(data[keys[i]]);

          for (let indexKey = 0; indexKey < key2.length; indexKey++) {
            let tempSubKeyValue = data[keys[i]][key2[indexKey]];
            if (
              key2[indexKey].toUpperCase() === "OR" &&
              Array.isArray(tempSubKeyValue)
            ) {
              query += ` or ( ${keys[i]} = :${flag}`;
              for (
                let indexValue = 1;
                indexValue < tempSubKeyValue.length;
                indexValue++
              ) {
                query += ` or ` + keys[i] + ` = :${flag}`;
              }
              query += ` ) `;
            } else if (key2[indexKey].toUpperCase() === "OR") {
              query +=
                ` or ${key2[indexKey].toLowerCase()} ` + keys[i] + ` = :${flag}`;
            } else if (key2[indexKey].toUpperCase() === "LIKE") {
              query += ` and  ${keys[i]} like :${flag}`;
            } else if (["IN", "NOT IN"].includes(key2[indexKey].toUpperCase())) {
              query += ` and  ${keys[i]}  ${key2[
                indexKey
              ].toUpperCase()} ( :${flag}) `;
            } else if (["IN QUERY"].includes(key2[indexKey].toUpperCase())) {
              query += ` and  ${keys[i]}  IN ( ${
                data[keys[i]][key2[indexKey]]
              } ) `;
            } else if (["NOT IN QUERY"].includes(key2[indexKey].toUpperCase())) {
              query += ` and  ${keys[i]}  NOT IN ( ${
                data[keys[i]][key2[indexKey]]
              } ) `;
            } else if ("GTE" == key2[indexKey].toUpperCase()) {
              query += ` and ` + keys[i] + ` >= :${flag}`;
            } else if ("GT" == key2[indexKey].toUpperCase()) {
              query += ` and ` + keys[i] + ` > :${flag}`;
            } else if ("LTE" == key2[indexKey].toUpperCase()) {
              query += ` and ` + keys[i] + ` <= :${flag}`;
            } else if ("LT" == key2[indexKey].toUpperCase()) {
              query += ` and ` + keys[i] + ` < :${flag}`;
            } else if ("NOT EQ" == key2[indexKey].toUpperCase()) {
              query += ` and ` + keys[i] + ` != :${flag}`;
            }
          }
        } else {
          query += ` and ` + keys[i] + ` = :${flag}`;
        }
      }
    }

    if (!isEmpty(orderBy)) {
      keys = Object.keys(orderBy);
      query += ` order by ${keys[0]} ${orderBy[keys[0]]} `;

      for (let i = 1; i < keys.length; i++) {
        query += `, ${keys[i]} ${orderBy[keys[i]]} `;
      }
    }

    // query += ` LIMIT ${offset}, ${limit}`;
    return query;
  };

  let rfqInvitedSupplierList = async (whereData, offset, limit) => {
    console.log(whereData);
    let whereClause = "";
    let queryParams = [];

    // Construct the WHERE clause based on the properties of whereData
    if (whereData != null && Object.keys(whereData).length > 0) {
      let conditions = [];
      Object.keys(whereData).forEach((key) => {
        conditions.push(`RSI.${key} = NVL('${whereData[key]}', RSI.${key})`); // Use NVL to handle null values
        queryParams.push(whereData[key]);
      });
      whereClause = "WHERE " + conditions.join(" AND ");
    }

    // Construct the query string with bind variables
    let query = `
        SELECT 
        SBI.ORGANIZATION_NAME,
      NVL(SRG.PROFILE_PIC1_FILE_NAME,'N/A')PROFILE_PIC1_FILE_NAME,
      NVl(SRG.PROFILE_PIC2_FILE_NAME,'N/A')PROFILE_PIC2_FILE_NAME,
      RSI.*  
        FROM ${dbName}.${rfq_supplier_invite_table_name} RSI 
        LEFT JOIN  XXP2P.XXP2P_SUPPLIER_BSC_INFO SBI ON SBI.USER_ID = RSI.USER_ID
      LEFT JOIN  XXP2P.XXP2P_SUPPLIER_REGISTRATION_DOCUMENTS SRG ON SRG.USER_ID = RSI.USER_ID
        ${whereClause} ORDER BY 1 DESC`;

    // Add OFFSET and LIMIT if provided in whereData
    if (offset != null && limit != null) {
      query = query + ` OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
    }

    console.log(query);
    // Return the query string
    return query;
  };
  let rfqInvitedSupplierListTotal = async (whereData, offset, limit) => {
    console.log(whereData);
    let whereClause = "";
    let queryParams = [];

    // Construct the WHERE clause based on the properties of whereData
    if (whereData != null && Object.keys(whereData).length > 0) {
      let conditions = [];
      Object.keys(whereData).forEach((key) => {
        conditions.push(`${key} = NVL('${whereData[key]}', ${key})`); // Use NVL to handle null values
        queryParams.push(whereData[key]);
      });
      whereClause = "WHERE " + conditions.join(" AND ");
    }

    // Construct the query string with bind variables
    let query = `
        SELECT 
          COUNT(USER_ID)TOTAL 
        FROM ${dbName}.${rfq_supplier_invite_table_name}  
        ${whereClause} ORDER BY 1 DESC`;

    // Add OFFSET and LIMIT if provided in whereData
    if (offset != null && limit != null) {
      query = query + ` OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
    }

    console.log(query);
    // Return the query string
    return query;
  };

  let rfqSubmittedDetails = async (whereData, USER_ID, offset, limit) => {
    console.log(USER_ID);
    let whereClause = "";
    let queryParams = [];

    // Construct the WHERE clause based on the properties of whereData
    if (whereData != null && Object.keys(whereData).length > 0) {
      let conditions = [];
      Object.keys(whereData).forEach((key) => {
        // Specify the table alias for the column
        conditions.push(
          `RFQ_LINES.${key} = NVL('${whereData[key]}', RFQ_LINES.${key})`
        ); // Use NVL to handle null values
        queryParams.push(whereData[key]);
      });
      whereClause = "WHERE " + conditions.join(" AND ");
    }

    // Construct the query string with join and bind variables
    let query = `
          SELECT 
 RFQ_LINES.RFQ_LINE_ID,
  RFQ_LINES.RFQ_ID,
  RFQ_LINES.REQUISITION_HEADER_ID,
  RFQ_LINES.REQUISITION_LINE_ID,
  RFQ_LINES.PR_NUMBER,
  RFQ_LINES.LINE_NUM,
  RFQ_LINES.LINE_TYPE_ID,
  RFQ_LINES.ITEM_CODE,
  RFQ_LINES.ITEM_DESCRIPTION,
  RFQ_LINES.ITEM_SPECIFICATION,
  RFQ_LINES.WARRANTY_DETAILS as BUYER_WARRANTY_DETAILS,
  RFQ_LINES.PACKING_TYPE,
  RFQ_LINES.PROJECT_NAME,
  RFQ_LINES.EXPECTED_QUANTITY,
  RFQ_LINES.EXPECTED_BRAND_NAME,
  RFQ_LINES.EXPECTED_ORIGIN,
  RFQ_LINES.LCM_ENABLE_FLAG,
  RFQ_LINES.UNIT_MEAS_LOOKUP_CODE,
  RFQ_LINES.NEED_BY_DATE,
  RFQ_LINES.ORG_ID,
  RFQ_LINES.ATTRIBUTE_CATEGORY,
  RFQ_LINES.PR_FROM_DFF,
  RFQ_LINES.AUTHORIZATION_STATUS,
  RFQ_LINES.NOTE_TO_SUPPLIER,
  RFQ_LINES.WARRANTY_ASK_BY_BUYER,
  RFQ_LINES.BUYER_VAT_APPLICABLE,
  RFQ_LINES.DELIVER_TO_LOCATION_ID,
  RFQ_LINES.DESTINATION_ORGANIZATION_ID,
  RFQ_LINES.CS_STATUS,
  RFQ_LINES.CREATION_DATE,
  RFQ_LINES.CREATED_BY,
  RFQ_LINES.LAST_UPDATED_BY,
  RFQ_LINES.LAST_UPDATE_DATE,
  RFQ_LINES.BUYER_FILE_ORG_NAME,
  RFQ_LINES.BUYER_FILE_NAME,
  RFQ_LINES.ITEM_ID,
  RFQ_LINES.RATE_TYPE,
  RFQ_LINES.RATE_DATE,
  RFQ_LINES.CONVERSION_RATE,
  RFQ_LINES.LINE_TYPE,
  RFQ_LINES.MATCH_OPTION,
  RFQ_LINES.PR_LINE_NUM,
  RFQ_LINES.PR_APPROVED_DATE,
  RFQ_LINES.LINE_STATUS as RFQ_LINE_STATUS,
  
  
   SUPPLIER_QUOTATION.QUOT_LINE_ID,
  SUPPLIER_QUOTATION.RFQ_LINE_ID,
  SUPPLIER_QUOTATION.RFQ_ID,
  SUPPLIER_QUOTATION.USER_ID,
  SUPPLIER_QUOTATION.WARRANTY_BY_SUPPLIER,
  SUPPLIER_QUOTATION.SUPPLIER_VAT_APPLICABLE,
  SUPPLIER_QUOTATION.UNIT_PRICE,
  SUPPLIER_QUOTATION.OFFERED_QUANTITY,
  SUPPLIER_QUOTATION.PROMISE_DATE,
  SUPPLIER_QUOTATION.SUP_FILE_ORG_NAME,
  SUPPLIER_QUOTATION.SUP_FILE_NAME,
  SUPPLIER_QUOTATION.CREATION_DATE,
  SUPPLIER_QUOTATION.CREATED_BY,
  SUPPLIER_QUOTATION.LAST_UPDATED_BY,
  SUPPLIER_QUOTATION.LAST_UPDATE_DATE,
  SUPPLIER_QUOTATION.AVAILABLE_BRAND_NAME,
  SUPPLIER_QUOTATION.AVAILABLE_ORIGIN,
  SUPPLIER_QUOTATION.AVAILABLE_SPECS,
  SUPPLIER_QUOTATION.TOLERANCE,
  SUPPLIER_QUOTATION.TOTAL_LINE_AMOUNT,
  SUPPLIER_QUOTATION.VAT_TYPE,
  SUPPLIER_QUOTATION.VAT_AMOUNT,
  SUPPLIER_QUOTATION.LINE_STATUS as QUOT_LINE_STATUS,
  SUPPLIER_QUOTATION.FREIGHT_CHARGE,
  SUPPLIER_QUOTATION.WARRANTY_DETAILS as SUPPLIER_WARRANTY_DETAILS,
  SUPPLIER_QUOTATION.COUNTRY_CODE,
  SUPPLIER_QUOTATION.COUNTRY_NAME
          FROM ${dbName}.${rfq_lines_table_name} RFQ_LINES
          LEFT JOIN ${dbName}.XXP2P_RFQ_SUPPLIER_QUOTATION SUPPLIER_QUOTATION
          ON RFQ_LINES.RFQ_LINE_ID = SUPPLIER_QUOTATION.RFQ_LINE_ID
          AND RFQ_LINES.RFQ_ID = SUPPLIER_QUOTATION.RFQ_ID
          AND SUPPLIER_QUOTATION.USER_ID = ${USER_ID}
          ${whereClause}
          ORDER BY RFQ_LINES.RFQ_LINE_ID DESC`;

    // Add OFFSET and LIMIT if provided in whereData
    if (offset != null && limit != null) {
      query = query + ` OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
    }

    console.log(query);
    // Return the query string
    return query;
  };

  let supplierDelete = async (ids) => {
    let rfqLineIdPlaceholders = ids.map((id, index) => `${id}`).join(",");
    let query = `delete from xxp2p.XXP2P_RFQ_SUPPLIER_INVITATION where INVITATION_ID IN (${rfqLineIdPlaceholders})`;
    console.log(query);
    return query;
  };

  let emailSentStatusUpdate = async (list) => {
    // Create an array of placeholders for RFQ_LINE_ID
    let poHeaderID = list.map((id, index) => `${id}`).join(",");

    // Construct the query string with join and bind variables
    let query = `update xxp2p.XXP2P_RFQ_SUPPLIER_INVITATION SET EMAIL_SENT_STATUS = 1
    where INVITATION_ID IN (${poHeaderID})`;

    return query;
  };

  let getPOTotalOfSupplier = async (USER_ID) => {
    // Create an array of placeholders for RFQ_LINE_ID

    // Construct the query string with join and bind variables
    let query = `select COUNT(DISTINCT(PO_HEADER_ID)) AS TOTAL_PO, MAX(PO_DATE) AS PO_DATE 
  from xxp2p.xxp2p_cs_lines_all where user_id = ${USER_ID}`;

    return query;
  };
  module.exports = {
    rfqCreation,
    addNewRFQHeader,
    addNewRFQLines,
    addNewRFQInviteSuppliers,
    getDataByWhereCondition,
    rfqAllList,
    rfqAllListTotal,
    rfqAllDetailsTotal,
    rfqDetails,
    rfqSupplierList,
    rfqAllSupplierListTotal,
    rfqHeaderUpdate,
    rfqLineItemUpdate,
    employeeNameById,
    categoryList,
    supplierList,
    supplierListTotal,
    supplierNumberFromEBS,
    locationList,
    invoiceTypeList,
    deleteLineItem,
    freightTermsList,
    paymentTermsList,
    locationNameById,
    inventoryStock,
    generalTermsList,
    rfqHeaderDetails,
    rfqInvitedSupplierList,
    rfqInvitedSupplierListTotal,
    rfqSubmittedDetails,
    ouWiseStock,
    orgWiseSupplierSite,
    supplierContact,
    supplierNumberFromEBSCount,
    supplierDelete,
    emailSentStatusUpdate,
    getPOTotalOfSupplier,
  };
