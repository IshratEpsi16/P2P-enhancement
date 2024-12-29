import React, { useState, useEffect, useRef } from "react";
import PageTitle from "../../common_component/PageTitle";
import NavigationPan from "../../common_component/NavigationPan";
import {
  RoleDatum,
  RolePermissionInterface,
} from "../interface/RolePermissionInterface";
import RolePermissionViewService from "../service/RolePermissionViewSerivce";
import { useAuth } from "../../login_both/context/AuthContext";
import SuccessModal from "../../common_component/SuccessModal";
import DeleteModal from "../../common_component/DeleteModal";
import DeleteRoleService from "../service/RoleDeleteService";

import ErrorToast, { showErrorToast } from "../../Alerts_Component/ErrorToast";
import SuccessToast, {
  showSuccessToast,
} from "../../Alerts_Component/SuccessToast";

import MenuAndPermissionGrantRevokeService from "../service/MenuAndPermissionGrantRevokeService";
import TableSkeletonLoader from "../../Loading_component/skeleton_loader/TableSkeletonLoader";
import NoDataFound from "../../utils/methods/component/NoDataFound";
import LogoLoading from "../../Loading_component/LogoLoading";
import DeleteIcon from "../../icons/DeleteIcon";
import _ from "lodash";

import CommonInputField from "../../common_component/CommonInputField";
import CommonButton from "../../common_component/CommonButton";
import RoleCreationService from "../service/RoleCreationService";
import AllMenuPermissionGetService from "../service/AllMenuPermissionGetService";
import {
  MenuInterface,
  PermissionInterface,
} from "../interface/MenuPermissionInterface";
import CircularProgressIndicator from "../../Loading_component/CircularProgressIndicator";

import WarningModal from "../../common_component/WarningModal";

const list = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3];
const pan = ["Home", "Role & Menu Permission Manager"];

export default function RoleMenuPermissionManager() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [roleMenuPermissionList, setRoleMenuPermissionList] =
    useState<RolePermissionInterface | null>(null);
  const [permissionMenuList, setPermissionMenuList] = useState<
    RoleDatum[] | null
  >(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const { token } = useAuth();
  useEffect(() => {
    getRolePermission();
  }, []);

  const getRolePermission = async () => {
    setIsLoading(true);
    const result = await RolePermissionViewService(token!);
    // setRoleMenuPermissionList(result.data);
    setPermissionMenuList(result.data.data);

    setIsLoading(false);
  };

  const grantRevoke = async (
    roleId: number | null,
    menuId: number | null,
    permissionId: number | null
  ) => {
    console.log(roleId);
    console.log(menuId);
    console.log(menuId);

    const result = await MenuAndPermissionGrantRevokeService(
      token!,
      roleId,
      menuId,
      permissionId
    );
    if (result.data.status === 200) {
      showSuccessToast(result.data.message);
    } else {
      console.log(result.data.message);

      showErrorToast(result.data.message);
    }
  };

  const [roleId, setRoleId] = useState<number | null>(null);
  const deleteRole = async () => {
    const result = await DeleteRoleService(token!, roleId!);
    if (result.data.status === 200) {
      showSuccessToast(result.data.message);
      getRolePermission();
    } else {
      showErrorToast(result.data.message);
    }
  };
  const openDeleteModal = (id: number) => {
    // console.log(id);

    setRoleId(id);
    setIsDeleteOpen(true);
  };
  const closeModal = () => {
    setRoleId(null);
    setIsDeleteOpen(false);
  };

  type MenuType = "Permission" | "Menu";

  const handleButtonClick = (
    menuIndex: number,
    buttonIndex: number,
    menuType: MenuType
  ) => {
    setPermissionMenuList((prevMenuList) => {
      if (!prevMenuList) {
        return null;
      }

      const updatedMenuList = [...prevMenuList];
      const updatedMenu = { ...updatedMenuList[menuIndex] };

      if (!updatedMenu) {
        return null;
      }

      const updatedButton = { ...updatedMenu[menuType][buttonIndex] };

      // Toggle IS_ASSOCIATED value
      updatedButton.IS_ASSOCIATED = updatedButton.IS_ASSOCIATED === 1 ? 0 : 1;

      // Update the button in the menu
      updatedMenu[menuType][buttonIndex] = updatedButton;

      // Update the menu in the menu list
      updatedMenuList[menuIndex] = updatedMenu;

      return updatedMenuList;
    });
  };

  // const handleButtonClick = (menuIndex:number, buttonIndex:number, menuType:string) => {
  //     setPermissionMenuList(prevMenuList => {
  //         if(!prevMenuList){
  //             return null;
  //         }
  //         const updatedMenuList = [...prevMenuList];
  //         const updatedMenu = { ...updatedMenuList[menuIndex] };
  //         if(!updatedMenu){
  //             return null;
  //         }
  //         const updatedButton = { ...updatedMenu[menuType][buttonIndex] };

  //         updatedButton.IS_ASSOCIATED = updatedButton.IS_ASSOCIATED === 1 ? 0 : 1;
  //         updatedMenu[menuType][buttonIndex] = updatedButton;
  //         updatedMenuList[menuIndex] = updatedMenu;

  //         return updatedMenuList;
  //     });
  // };

  const [roleName, setRoleName] = useState<string>("");
  const roleRef = useRef<HTMLInputElement | null>(null);
  const [createdRoleId, setCreatedRoleId] = useState<number | null>(null);
  const [isRoleCreationLoading, setIsRoleCreationLoading] =
    useState<boolean>(false);
  const [menuList, setMenuList] = useState<MenuInterface[] | []>([]);
  const [permissionList, setPermissionList] = useState<
    PermissionInterface[] | []
  >([]);
  const [selectedPermissionList, setSelectedPermissionList] = useState<
    PermissionInterface[] | []
  >([]);
  const [selectedMenuList, setSelectedMenuList] = useState<
    MenuInterface[] | []
  >([]);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);

  const handleChangeRole = (value: string) => {
    setRoleName(value);
    if (roleRef.current) {
      roleRef.current.value = value;
    }
  };

  const createRole = async () => {
    // "message": "Inserted",
    // "status": 200,
    // "role_id": 221
    setIsRoleCreationLoading(true);
    const result = await RoleCreationService(token!, roleName);
    if (result.data.status === 200) {
      showSuccessToast(result.data.message);
      setCreatedRoleId(result.data.role_id);
      getMenuPermission();
      setIsPopupVisible(true);
    } else {
      showErrorToast(result.data.message);
      console.log("error: ", result.data);
      setIsPopupVisible(false);
      setIsRoleCreationLoading(false);
    }
  };

  const getMenuPermission = async () => {
    const result = await AllMenuPermissionGetService(token!);
    console.log(result.data);
    console.log(result.data.data[0].Menu);
    console.log(result.data.data[0].Permission);

    if (result.data.status === 200) {
      setMenuList(result.data.data[0].Menu);
      console.log("permissionList: ", result.data);
      setPermissionList(result.data.data[0].Permission);
      setIsRoleCreationLoading(false);
    } else {
      setIsRoleCreationLoading(false);
      showErrorToast("Something went wrong");
    }
  };

  const togglePermission = (permission: PermissionInterface) => {
    // Check if the permission is already in the selectedPermissionList
    const isSelected = selectedPermissionList.some(
      (selectedPermission) => selectedPermission === permission
    );

    if (isSelected) {
      // If the permission is already selected, remove it
      removeFromSelectedPermission(permission);
      setPermissionToRole(permission);
    } else {
      // If the permission is not selected, add it
      addToSelectedPermission(permission);
      setPermissionToRole(permission);
    }
  };

  const removeFromSelectedPermission = (
    permissionToRemove: PermissionInterface
  ) => {
    // Use filter to create a new array that excludes the permission to remove
    setSelectedPermissionList((prevList) =>
      prevList.filter((permission) => permission !== permissionToRemove)
    );
  };

  const setPermissionToRole = async (permission: PermissionInterface) => {
    const result = await MenuAndPermissionGrantRevokeService(
      token!,
      createdRoleId,
      null,
      permission.PERMISSION_ID
    );
    if (result.data.status === 200) {
      showSuccessToast(result.data.message);
    } else {
      removeFromSelectedPermission(permission);
      showErrorToast(result.data.message);
    }
  };

  const addToSelectedPermission = (permission: PermissionInterface) => {
    // Use the spread operator to create a new array with the existing elements
    // and add the new permission to it
    setSelectedPermissionList((prevList) => [...prevList, permission]);
  };

  const toggleMenu = (menu: MenuInterface) => {
    // Check if the permission is already in the selectedPermissionList
    const isSelected = selectedMenuList.some(
      (selectedPermission) => selectedPermission === menu
    );

    if (isSelected) {
      // If the menu is already selected, remove it
      removeFromSelectedMenu(menu);
      setMenuToRole(menu);
    } else {
      // If the menu is not selected, add it
      addToSelectedMenu(menu);
      setMenuToRole(menu);
    }
  };

  const removeFromSelectedMenu = (menuToRemove: MenuInterface) => {
    // Use filter to create a new array that excludes the menu to remove
    setSelectedMenuList((prevList) =>
      prevList.filter((permission) => permission !== menuToRemove)
    );
  };

  const setMenuToRole = async (menu: MenuInterface) => {
    const result = await MenuAndPermissionGrantRevokeService(
      token!,
      createdRoleId,
      menu.MENU_ID,
      null
    );
    if (result.data.status === 200) {
      showSuccessToast(result.data.message);
    } else {
      removeFromSelectedMenu(menu);
      showErrorToast(result.data.message);
    }
  };

  const addToSelectedMenu = (menu: MenuInterface) => {
    // Use the spread operator to create a new array with the existing elements
    // and add the new menu to it
    setSelectedMenuList((prevList) => [...prevList, menu]);
  };

  const buttonDisabled = !roleName || isRoleCreationLoading;

  const savePermissionsAndMenus = async () => {
    setIsSaveLoading(true);

    try {
      // Simulate saving process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showSuccessToast("Permissions and Menu saved successfully.");
      getRolePermission();
      setRoleName("");
      setIsPopupVisible(false);
    } catch (error) {
      showErrorToast("Error saving Permissions and Menus.");
    }

    setIsSaveLoading(false);
  };

  // searching role start

  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredMenuList = (permissionMenuList ?? []).filter((menuPermission) =>
    menuPermission.ROLE_NAME.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // searching role end

  return (
    <div className="m-8">
      <SuccessToast />

      <WarningModal
        isOpen={isDeleteOpen}
        closeModal={closeModal}
        action={deleteRole}
        message="Do you want to Delete Role ?"
      />
      {/* <SuccessModal isOpen={true} navigateTo={() => { deleteRole('jsdnf') }} message="U want to delete" closeModal={closeModal} navigationRoute="/kjsdfh" /> */}
      <div className=" flex flex-col items-start">
        <div className="flex items-center justify-between w-full">
          <PageTitle titleText="Role & Menu Permission Manager" />

          <input
            type="text"
            placeholder="Search Role Name"
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-2 w-52 border-[0.5px] bg-white border-borderColor rounded focus:outline-none"
          />

          {isLoading ? (
            <CircularProgressIndicator />
          ) : (
            <div className=" flex flex-row space-x-2 items-start">
              {/* <CommonInputField
                onChangeData={handleChangeRole}
                hint="My Role"
                type="text"
                inputRef={roleRef}
              /> */}

              <input
                type="text"
                placeholder="My Role"
                ref={roleRef}
                value={roleName}
                onChange={(e) => handleChangeRole(e.target.value)}
                className="w-60 p-2 border-[0.5px] bg-white border-borderColor rounded focus:outline-none"
              />
              <div className={`${buttonDisabled ? "opacity-50" : ""}`}>
                <CommonButton
                  onClick={createRole}
                  titleText={"Create Role"}
                  width="w-28"
                  color="bg-midGreen"
                  disable={buttonDisabled}
                />
              </div>
            </div>
          )}
        </div>

        <div className="h-6"></div>

        {isPopupVisible && (
          <>
            {isRoleCreationLoading ? (
              <div className=" w-full flex justify-center items-center">
                <CircularProgressIndicator />
              </div>
            ) : !isRoleCreationLoading && menuList.length === 0 ? null : (
              <>
                <p className=" text-blackColor text-[16px] font-mon font-semibold">
                  Permission
                </p>
                <div className=" h-8"></div>
                <div className=" grid grid-cols-5 gap-6">
                  {permissionList?.map((e, i) => (
                    <div className=" w-40 flex flex-row space-x-2 items-start">
                      <button
                        onClick={() => {
                          togglePermission(e);
                        }}
                        className={`w-[14px] h-[14px] rounded-[4px] mt-1 flex justify-center items-center  
                        ${
                          selectedPermissionList.some(
                            (permission) =>
                              permission.PERMISSION_ID === e.PERMISSION_ID
                          )
                            ? "bg-midGreen border-none"
                            : "border-[1px] border-borderColor bg-whiteColor"
                        }`}
                      >
                        {
                          <img
                            src="/images/check.png"
                            alt="check"
                            className="w-[7px] h-[7px]"
                          />
                        }
                      </button>
                      <p className=" w-36 text-blackColor text-sm font-mon font-medium text-start">
                        {e.P_DESCRIPTION}
                      </p>
                    </div>
                  ))}
                </div>
                <div className=" h-8"></div>
                <p className=" text-blackColor text-[16px] font-mon font-semibold">
                  Menu
                </p>
                <div className=" h-8"></div>
                <div className=" grid grid-cols-5 gap-6">
                  {menuList?.map((e, i) => (
                    <div className=" w-40 flex flex-row space-x-2 items-start">
                      <button
                        onClick={() => {
                          toggleMenu(e);
                        }}
                        className={`w-[14px] h-[14px] rounded-[4px] mt-1 flex justify-center items-center   ${
                          selectedMenuList.some(
                            (menu) => menu.MENU_ID === e.MENU_ID
                          )
                            ? "bg-midGreen border-none"
                            : "border-[0.5px] border-borderColor bg-whiteColor"
                        }`}
                      >
                        {
                          // <svg
                          //   xmlns="http://www.w3.org/2000/svg"
                          //   fill="none"
                          //   viewBox="0 0 24 24"
                          //   strokeWidth={1.5}
                          //   stroke="currentColor"
                          //   className="w-2 h-2 text-white"
                          // >
                          //   <path
                          //     strokeLinecap="round"
                          //     strokeLinejoin="round"
                          //     d="M4.5 12.75l6 6 9-13.5"
                          //   />
                          // </svg>

                          <img
                            src="/images/check.png"
                            alt="check"
                            className="w-[7px] h-[7px]"
                          />
                        }
                      </button>
                      <p className=" w-36 text-blackColor text-sm font-mon font-medium text-start">
                        {e.MENU_NAME}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="h-8"></div>
                <div className="flex justify-center w-full">
                  {isSaveLoading ? (
                    <CircularProgressIndicator />
                  ) : (
                    <div className="flex items-center justify-end w-full">
                      <CommonButton
                        onClick={savePermissionsAndMenus}
                        titleText="Save"
                        width="w-32"
                        color="bg-midGreen"
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* <div className="h-4"></div> */}

        {/* <NavigationPan list={pan} /> */}
        <div className="h-2"></div>
        {isLoading ? (
          <div className=" w-full ">
            <LogoLoading />
          </div>
        ) : !isLoading && filteredMenuList?.length === 0 ? (
          <NoDataFound />
        ) : (
          <>
            <div className="w-full h-14 flex flex-row  space-x-4  items-center  bg-[#CAF4FF] rounded-t-md border-[0.5px] border-borderColor ">
              <div className="w-28 h-full text-sm font-mon text-blackishColor font-semibold  flex justify-start items-center px-8">
                Role
              </div>
              <div className="w-28 h-full text-sm font-mon text-blackishColor font-semibold  flex justify-start items-center">
                Name
              </div>
              <div className="flex-1 h-full text-sm font-mon text-blackishColor font-semibold  flex justify-start items-center">
                Permission & Menu
              </div>
              <div className="w-14 h-full text-sm font-mon text-blackishColor font-semibold  flex justify-start items-center  ">
                Action
              </div>
            </div>
            {/* loop er last er jonno rounded-b-md dibo */}
            {filteredMenuList?.map((menuPermission, k) => (
              <div
                key={menuPermission.ROLE_ID}
                className={`w-full py-4 flex flex-row  space-x-4 ${
                  k === 2 ? " rounded-b-md" : ""
                }  items-start    border-r-[0.5px] border-b-[0.5px] border-l-[0.5px] border-borderColor`}
              >
                <div className="w-28 h-full font-bold flex justify-start items-center text-[16px] font-mon text-blackColor px-8">
                  {menuPermission.ROLE_NAME}
                </div>

                {
                  <div className=" flex-1 flex-col items-start space-y-10">
                    <div className=" flex-1 h-full   flex flex-row space-x-4  items-start">
                      <div className="w-28 h-full  flex justify-start items-center text-[14px] font-mon font-semibold text-blackColor ">
                        Permission
                      </div>

                      <div className="flex-1 h-full  flex justify-start items-start text-sm font-mon font-medium text-blackColor">
                        <div className=" grid grid-cols-4 gap-8 pr-6">
                          {
                            // _.sortBy(menuPermission.Permission, [
                            //   "DESCRIPTION",
                            // ])

                            menuPermission.Permission.map((e, i) => (
                              <div
                                key={e.PERMISSION_ID}
                                className=" flex flex-row space-x-2 items-start w-40 "
                              >
                                {/* w-4 h-4 rounded-[4px] border-[0.1px] border-borderColor */}
                                <button
                                  onClick={() => {
                                    handleButtonClick(k, i, "Permission");
                                    grantRevoke(
                                      menuPermission.ROLE_ID,
                                      null,
                                      e.PERMISSION_ID
                                    );
                                  }}
                                  className={`rounded-[4px] w-[14px] h-[14px] mt-1 ${
                                    e.IS_ASSOCIATED === 1
                                      ? "bg-midGreen "
                                      : "bg-whiteColor border-[1px] border-borderColor"
                                  } flex justify-center items-center `}
                                >
                                  <img
                                    src="/images/check.png"
                                    alt="check"
                                    className="w-[7px] h-[7px]"
                                  />
                                </button>
                                <p className=" w-32 text-[12px] font-mon font-medium text-blackColor">
                                  {e.DESCRIPTION}
                                </p>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                    <div className=" flex-1 h-full   flex flex-row space-x-4 items-start">
                      <div className="w-28 h-full  flex justify-start items-center text-sm font-mon font-semibold text-blackColor ">
                        Menu
                      </div>

                      <div className="flex-1 h-full  flex justify-start items-start text-sm font-mon font-medium text-blackColor">
                        <div className=" grid grid-cols-4 gap-8 pr-6">
                          {
                            // _.sortBy(menuPermission.Menu, ["MENU_NAME"])

                            menuPermission.Menu.map((e, i) => (
                              <div
                                key={e.MENU_ID}
                                className=" flex flex-row space-x-2 items-start w-40"
                              >
                                {/* w-4 h-4 rounded-[4px] border-[0.1px] border-borderColor */}
                                <button
                                  onClick={() => {
                                    handleButtonClick(k, i, "Menu");
                                    grantRevoke(
                                      menuPermission.ROLE_ID,
                                      e.MENU_ID,
                                      null
                                    );
                                  }}
                                  className={`rounded-[4px] w-[14px] h-[14px] mt-1 ${
                                    e.IS_ASSOCIATED === 1
                                      ? "bg-midGreen "
                                      : "bg-whiteColor border-[1px] border-borderColor"
                                  } flex justify-center items-center`}
                                >
                                  <img
                                    src="/images/check.png"
                                    alt="check"
                                    className="w-[7px] h-[7px]"
                                  />
                                </button>
                                <p className=" w-32 text-[12px] font-mon font-medium text-blackColor">
                                  {e.MENU_NAME}
                                </p>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                }

                <div className="pr-4">
                  {menuPermission.CAN_DELETE === 1 ? (
                    <button
                      onClick={() => {
                        openDeleteModal(menuPermission.ROLE_ID);
                      }}
                      className="h-full flex justify-center items-center py-2 px-2 rounded-md shadow-sm border-borderColor border-[0.5px]"
                    >
                      <DeleteIcon className=" text-gray-500" />
                    </button>
                  ) : (
                    <div className="w-14"></div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
