import React, { useState, useEffect } from "react";
import PageTitle from "../../common_component/PageTitle";
import "./../css/bannerTableCss.css";
import DeleteIcon from "../../icons/DeleteIcon";
import useBannerUploadStore from "../store/bannerUploadStore";
import AddIcon from "../../icons/AddIcon";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";
import BannerListService from "../service/BannerListService";
import { useAuth } from "../../login_both/context/AuthContext";
import BannerImageInterface from "../interface/BannerImageInterface";
import LogoLoading from "../../Loading_component/LogoLoading";
import NotFoundPage from "../../not_found/component/NotFoundPage";
import BannerAddUpdateService from "../service/BannerAddUpdateService";
import BannerDeleteService from "../service/BannerDeleteService";
import NewDeleteModal from "../../common_component/NewDeleteModal";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import ArrowRightIcon from "../../icons/ArrowRightIcon";
import fetchFileUrlService from "../../common_service/fetchFileUrlService";

export default function BannerListPage() {
  const { setPageNo } = useBannerUploadStore();

  const { token } = useAuth();

  const navigateToAddBanner = () => {
    setPageNo(2);
  };

  const handleActivation = (index: number) => {
    console.log("index: ", index);
    const newImageList = [...imageList];
    newImageList[index].IS_ACTIVE = newImageList[index].IS_ACTIVE === 0 ? 1 : 0;
    setImageList(newImageList);
    console.log("value: ", newImageList);
    updateImage(newImageList[index]);
  };

  const updateImage = async (item: BannerImageInterface) => {
    try {
      const result = await BannerAddUpdateService(
        token!,
        item.ID,
        item.BANNER_SEQUENCE,
        item.BANNER_TYPE,
        item.SHOW_FOR,
        item.IS_ACTIVE
      );

      if (result.data.status === 200) {
        showSuccessToast(result.data.message);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Banner Update Failed");
    }
  };

  const deleteBanner = async (e: BannerImageInterface) => {
    try {
      const result = await BannerDeleteService(token!, e.ID, e.IMG_NAME);
      if (result.data.status === 200) {
        showSuccessToast(result.data.message);
        getBannerList(offset, limit);
      } else {
        showErrorToast(result.data.message);
      }
    } catch (error) {
      showErrorToast("Banner Delete Failed");
    }
  };

  //pagination

  // const [total, setTotal] = useState<number | null>(null);
  // const [limit, setLimit] = useState<number>(5);
  // const [localPageNo, setPageLocalNo] = useState<number>(1);
  // const [offset, setOffSet] = useState<number>(0);
  const [total, setTotal] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(5);
  const [pageNo2, setPageNo2] = useState<number>(1);
  const [offset, setOffSet] = useState<number>(0);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  //pagination

  useEffect(() => {
    getBannerList(offset, limit);
  }, []);

  const [imageList, setImageList] = useState<BannerImageInterface[] | []>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [imagePath, setImagePath] = useState<string>("");

  const getBannerList = async (ofs: number, lmt: number) => {
    try {
      setIsLoading(true);

      const result = await BannerListService(token!, "", "", null, ofs, lmt);

      if (result.data.status === 200) {
        dividePage(result.data.total, lmt);
        setImageList(result.data.data);
        setImagePath(result.data.path);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        showErrorToast(result.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      showErrorToast("Banner Load Failed");
    }
  };

  const dividePage = (number: number, lmt: number) => {
    console.log(number);
    if (typeof number !== "number") {
      throw new Error("Input must be a number");
    }

    const re = Math.ceil(number / lmt);

    setTotal(re);
  };

  // const next = () => {
  //   let newOff;

  //   newOff = offset + limit;
  //   console.log(newOff);
  //   setOffSet(newOff);

  //   setPageLocalNo((pre: number) => pre + 1);
  //   console.log(limit);
  //   getBannerList(newOff, limit);
  // };

  // const previous = () => {
  //   let newOff = offset - limit;
  //   console.log(newOff);
  //   if (newOff < 0) {
  //     newOff = 0;
  //     console.log(newOff);
  //   }

  //   setOffSet(newOff);
  //   setPageLocalNo((pre: number) => pre - 1);
  //   console.log(limit);
  //   getBannerList(newOff, limit);
  // };

  const [selectedBanner, setSelectedBanner] =
    useState<BannerImageInterface | null>(null);

  const [isWarningShow, setIsWarningShow] = useState(false);
  const openWarningModal = () => {
    setIsWarningShow(true);
  };
  const closeWarningModal = () => {
    setIsWarningShow(false);
    setSelectedBanner(null);
  };

  const handleBannerSelect = (e: BannerImageInterface) => {
    setSelectedBanner(e);
    openWarningModal();
  };

  // new pagination start
  const renderPageNumbers = () => {
    const totalPages = total ?? 0;
    const pageWindow = 5;
    const halfWindow = Math.floor(pageWindow / 2);
    let startPage = Math.max(1, pageNo2 - halfWindow);
    let endPage = Math.min(totalPages, startPage + pageWindow - 1);

    if (endPage - startPage + 1 < pageWindow) {
      startPage = Math.max(1, endPage - pageWindow + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => {
            setPageNo2(i);
            setOffSet((i - 1) * limit);
            getBannerList((i - 1) * limit, limit);
          }}
          className={`w-6 h-6 text-[12px] border rounded-md ${
            pageNo2 === i ? "border-sky-400" : "border-transparent"
          }`}
          disabled={pageNo2 === i}
        >
          {i}
        </button>
      );
    }
    return pages;
  };
  // new pagination end

  const next = async () => {
    let newOff;

    newOff = offset + limit;
    console.log(newOff);
    setOffSet(newOff);

    setPageNo2((pre) => pre + 1);
    console.log(limit);
    // getHistory("", "", newOff, limit);
    getBannerList(newOff, limit);
  };

  const previous = async () => {
    let newOff = offset - limit;
    console.log(newOff);
    if (newOff < 0) {
      newOff = 0;
      console.log(newOff);
    }

    setOffSet(newOff);
    setPageNo2((pre) => pre - 1);
    console.log(limit);

    // getHistory("", "", newOff, limit);
    getBannerList(newOff, limit);
  };

  //banner list

  interface ImageUrls {
    [key: number]: string | null;
  }

  const [imageUrls, setImageUrls] = useState<ImageUrls>({});

  // ... other state and functions

  const getImage2 = async (
    filePath: string,
    fileName: string
  ): Promise<string | null> => {
    try {
      const url = await fetchFileUrlService(filePath, fileName, token!);
      return url;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  useEffect(() => {
    if (imageList) {
      const fetchImages = async () => {
        const newImageUrls: ImageUrls = {};
        for (let index = 0; index < imageList.length; index++) {
          const element = imageList[index];
          const url = await getImage2(imagePath, element.IMG_NAME);
          newImageUrls[element.ID] = url;
        }
        setImageUrls(newImageUrls);
        // setIsLoading(false);
      };
      fetchImages();
    }
  }, [imageList, imagePath]);

  return (
    <div>
      <SuccessToast />
      <NewDeleteModal
        isOpen={isWarningShow}
        closeModal={closeWarningModal}
        action={() => {
          deleteBanner(selectedBanner!);
        }}
        message={`Deleting banner image will erase this banner. This action can not be undone.`}
      />
      <div className=" mb-5 w-full flex justify-between items-center">
        <PageTitle titleText="Banner List" />
        <button
          onClick={navigateToAddBanner}
          className=" px-4 h-8 flex space-x-2 items-center bg-[#03AED2] rounded-md"
        >
          <AddIcon className=" text-white w-4 h-4" />
          <p className=" text-sm text-white font-mon font-medium">Add Banner</p>
        </button>
      </div>
      {isLoading ? (
        <div className=" w-full flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : !isLoading && imageList.length === 0 ? (
        <div>
          <NotFoundPage />
        </div>
      ) : (
        <div className="overflow-auto max-h-[400px] rounded-lg shadow-lg custom-scrollbar">
          <table className="min-w-full divide-y divide-gray-200 rounded-lg">
            <thead className="bg-[#CAF4FF] sticky top-0 z-20">
              <tr>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Sl
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Image
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Banner Type
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Published
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-900  tracking-wider font-mon">
                  Action
                </th>
              </tr>
            </thead>
            {imageList.map((e, i) => (
              <tbody className="bg-white divide-y divide-gray-200">
                <tr key={i}>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {i + 1}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar ">
                    <div className="w-full overflow-auto custom-scrollbar text-center flex justify-center items-center">
                      <img
                        // src={`${imagePath}/${e.IMG_NAME}`}
                        src={imageUrls[e.ID]!}
                        alt="banner"
                        className=" h-6 w-20 bg-contain"
                      />
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      {e.BANNER_TYPE}
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar flex items-center justify-center">
                      {/* <input
                        onChange={() => {
                          handleActivation(i);
                        }}
                        type="checkbox"
                        className={`toggle ${
                          e.IS_ACTIVE === 1
                            ? "bg-neonBlue border-neonBlue"
                            : "bg-graishColor"
                        }`}
                        checked={e.IS_ACTIVE === 1 ? true : false}
                      /> */}

                      <input
                        type="checkbox"
                        className="toggle border-gray-300 bg-white"
                        style={
                          {
                            "--tglbg":
                              e?.IS_ACTIVE === 1 ? "#00A76F" : "#ececec",
                          } as React.CSSProperties
                        }
                        checked={e?.IS_ACTIVE === 1}
                        onChange={() => handleActivation(i)}
                      />
                    </div>
                  </td>
                  <td className="overflow-auto px-6 py-4 whitespace-nowrap text-sm text-gray-500 custom-scrollbar">
                    <div className="w-full overflow-auto custom-scrollbar text-center">
                      <button
                        onClick={() => {
                          handleBannerSelect(e);
                        }}
                        className=" py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            ))}
            <tfoot className="bg-white sticky bottom-0">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center">
                  {pageNo2 !== 1 && (
                    <button
                      // disabled={pageNo === 1 ? true : false}
                      onClick={previous}
                      className=" px-4 py-2 rounded-md flex space-x-2 items-center border-[0.5px] border-borderColor "
                      style={{
                        boxShadow:
                          "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                      }}
                    >
                      <div className="w-4 h-4 ">
                        <ArrowLeftIcon className=" w-full h-full " />
                      </div>
                      <p className=" text-[12px]">Previous</p>
                    </button>
                  )}
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center  items-center">
                  {renderPageNumbers()}
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center items-center">
                  {pageNo2 !== total && (
                    <button
                      // disabled={pageNo === total ? true : false}
                      onClick={next}
                      className=" px-4 py-2 rounded-md flex space-x-2 items-center shadow-md border-[0.5px] border-borderColor "
                      style={{
                        boxShadow:
                          "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
                      }}
                    >
                      <p className=" text-[12px]">Next</p>
                      <div className="w-4 h-4 ">
                        <ArrowRightIcon className=" w-full h-full " />
                      </div>
                    </button>
                  )}
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
