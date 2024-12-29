interface ModuleInterface {
    MODULE_ID: number;
    MODULE_NAME: string;
    OU_ID: number | null;
    LE_ID: number | null;
    CREATED_BY: number;
    CREATION_DATE: string;
    LAST_UPDATE_BY: number | null;
    LAST_UPDATE_DATE: string;
  }

  export default ModuleInterface