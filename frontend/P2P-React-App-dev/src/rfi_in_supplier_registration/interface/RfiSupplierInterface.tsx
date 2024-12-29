interface RfiSupplierInterface {
  ID: number;
  OBJECT_ID: number;
  SUPPLIER_FULL_NAME: string;
  SUPPLIER_USER_NAME: string;
  SUPPLIER_ORGANIZATION_NAME: string;
  OBJECT_TYPE: string;
  INITIATOR_ID: number;
  INITIATOR_PRO_PIC: string;
  INITIATOR_NAME: string;
  INITIATION_DATE: string;
  INITIATOR_NOTE: string;
  VIEWER_ID: number;
  VIEWER_NAME: string;
  VIEWER_PRO_PIC: string;
  VIEW_DATE: string;
  VIEWER_NOTE: string;
  VIEWER_ACTION: number;
  STAGE_LEVEL: number;
  TEMPLATE_ID: number;
}

export default RfiSupplierInterface;
