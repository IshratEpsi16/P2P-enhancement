import React from "react";
interface TitleProp {
  titleText: string;
}
const PageTitle: React.FC<TitleProp> = ({ titleText }) => {
  return (
    <h1 className=" font-mon text-xl text-blackColor font-bold">{titleText}</h1>
  );
};

export default PageTitle;
