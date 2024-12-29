import React, { useRef, useState } from "react";
import PageTitle from "../../common_component/PageTitle";
import CommonButton from "../../common_component/CommonButton";
import useBannerUploadStore from "../store/bannerUploadStore";
import CommonInputField from "../../common_component/CommonInputField";
import FilePickerInput from "../../common_component/FilePickerInput";
import DropDown from "../../common_component/DropDown";
import BannerUploadService from "../service/BannerUploadService";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import { useAuth } from "../../login_both/context/AuthContext";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";

const bannerTypeList = [
  {
    label: "Main Banner",
    value: "Main Banner",
  },
  {
    label: "Side Banner",
    value: "Side Banner",
  },
];

const showForList = [
  {
    label: "Supplier",
    value: "Supplier",
  },
  {
    label: "Buyer",
    value: "Buyer",
  },
];

export default function BannerUploadPage() {
  const { setPageNo } = useBannerUploadStore();

  const { token } = useAuth();

  const back = () => {
    setPageNo(1);
  };

  const bannerSequenceRef = useRef<HTMLInputElement | null>(null);
  const [bannerSequence, setBannerSequence] = useState<string>("");
  const handleBannerSequenceChange = (value: string) => {
    setBannerSequence(value);
  };

  const [imageFileName, setImageFileName] = useState<string | null>("" || null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleBannerImage = (file: File | null) => {
    if (file) {
      // Handle the selected file here
      console.log("Selected file:", file);
      setImageFile(file);
    } else {
      // No file selected
      console.log("No file selected");
    }
  };

  const [selectedBannerType, setSelectedBannerType] = useState<string>("");

  //drop
  const handleBannerTypeSelect = (value: string) => {
    console.log(`Selected: ${value}`);

    setSelectedBannerType(value);

    // Do something with the selected value
  };
  //drop

  const [selectedShowFor, setSelectedShowFor] = useState("");

  const handleShowForChange = (value: string) => {
    setSelectedShowFor(value);
  };

  const [isUploadLoading, setIsUploadLoading] = useState<boolean>(false);

  const updateImage = async () => {
    try {
      setIsUploadLoading(true);
      const result = await BannerUploadService(
        token!,
        bannerSequence,
        selectedBannerType,
        selectedShowFor,
        imageFile
      );
      console.log(result.data);

      if (result.data.status === 200) {
        setIsUploadLoading(false);
        showSuccessToast(result.data.message);
        back();
      } else {
        setIsUploadLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsUploadLoading(false);
      showErrorToast("Banner Update Failed");
    }
  };

  return (
    <div className=" bg-white">
      <SuccessToast />
      <div className=" w-full mb-5 flex justify-between items-center">
        <PageTitle titleText="Banner Setup" />
        <CommonButton
          titleText="Back"
          color="bg-midGreen"
          onClick={back}
          width="w-24"
        />
      </div>

      <div className=" mb-5 w-full flex justify-between items-center">
        <div>
          <p className=" text-sm font-mon mb-1">Banner Sequence</p>
          <CommonInputField
            inputRef={bannerSequenceRef}
            onChangeData={handleBannerSequenceChange}
            hint="Enter Sequence Number"
            type="number"
          />
        </div>
        <div>
          <p className=" text-sm font-mon mb-1">Banner Image</p>
          <FilePickerInput
            onFileSelect={handleBannerImage}
            mimeType="image/*"
            initialFileName={imageFileName!}
            maxSize={5 * 1024 * 1024}
          />
        </div>
      </div>
      <div className=" mb-5 w-full flex justify-between items-center">
        <div>
          <p className=" text-sm font-mon mb-1">Banner Type</p>
          <DropDown
            options={bannerTypeList}
            onSelect={handleBannerTypeSelect}
            sval={selectedBannerType}
            width="w-96"
          />
        </div>
        <div>
          <p className=" text-sm font-mon mb-1">Show For Type</p>
          <DropDown
            options={showForList}
            onSelect={handleShowForChange}
            sval={selectedShowFor}
            width="w-96"
          />
        </div>
      </div>
      <div className="h-5"></div>
      <div className=" mb-5 w-full flex justify-between items-center">
        <div></div>
        {isUploadLoading ? (
          <div className=" w-48 flex justify-center items-center">
            <CircularProgressIndicator />
          </div>
        ) : (
          <CommonButton
            onClick={updateImage}
            titleText="Upload"
            width="w-48"
            color="bg-midGreen"
          />
        )}
      </div>
    </div>
  );
}
