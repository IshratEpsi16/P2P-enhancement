import React, { useEffect, useState } from "react";
import { useAuth } from "../../login_both/context/AuthContext";
import BannerImageInterface from "../../system_setup/interface/BannerImageInterface";
import { showErrorToast } from "../../Alerts_Component/ErrorToast";
import BannerListService from "../../system_setup/service/BannerListService";

import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

import "./../css/SupplierHomeCss.css";
import LogoLoading from "../../Loading_component/LogoLoading";
import NotFoundPage from "../../not_found/component/NotFoundPage";

export default function Supplierhome() {
  const images = [
    "https://images.unsplash.com/photo-1509721434272-b79147e0e708?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
    "https://images.unsplash.com/photo-1506710507565-203b9f24669b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1536&q=80",
    "https://images.unsplash.com/photo-1536987333706-fc9adfb10d91?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
  ];

  const { token } = useAuth();

  useEffect(() => {
    getBannerList(0, 10);
  }, []);

  const [imageList, setImageList] = useState<BannerImageInterface[] | []>([]);
  const [imageActiveList, setImageActiveList] = useState<
    BannerImageInterface[] | []
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [imagePath, setImagePath] = useState<string>("");

  const getBannerList = async (ofs: number, lmt: number) => {
    try {
      setIsLoading(true);

      const result = await BannerListService(
        token!,
        "Main Banner",
        "Supplier",
        1,
        ofs,
        lmt
      );

      if (result.data.status === 200) {
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

  return (
    <div className=" m-8 bg-white">
      {isLoading ? (
        <div className=" w-full flex justify-center items-center">
          <LogoLoading />
        </div>
      ) : !isLoading && imageList.length === 0 ? (
        <div>
          <NotFoundPage />
        </div>
      ) : (
        <Slide autoplay={true}>
          {imageList.map((e, i) => (
            <div className="each-slide-effect">
              <div
                style={{ backgroundImage: `url(${imagePath}/${e.IMG_NAME})` }}
              ></div>
            </div>
          ))}
        </Slide>
      )}
    </div>
  );
}
