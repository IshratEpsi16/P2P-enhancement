interface BannerImageInterface {
  ID: number;
  BANNER_SEQUENCE: number;
  BANNER_TYPE: string;
  SHOW_FOR: string;
  IMG_NAME: string;
  IS_ACTIVE: number;
  CREATED_BY: number;
  CREATION_DATE: string; // ISO 8601 format date
  LAST_UPDATED_BY: string | null; // Assuming it can be null if not provided
  LAST_UPDATE_DATE: string | null; // Assuming it can be null if not provided
}

export default BannerImageInterface;
