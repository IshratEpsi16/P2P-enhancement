/** @type {import('tailwindcss').Config} */
import keepPreset from "keep-react/src/keep-preset.js";
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-select/dist/index.esm.js",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
    "node_modules/keep-react/**/*.{js,jsx,ts,tsx}",
  ],

  presets: [keepPreset],
  theme: {
    extend: {
      colors: {
        blackishColor: "#454F5B",
        blackColor: "#000000",
        whiteColor: "#FFFFFF",
        borderColor: "#DADADA",
        midBlack: "#202020",
        inputBg: "#F9F9F9",
        hintColor: "#363636",
        fileInputBorder: "#C7CBCF",
        graishColor: "#8F9BAA",
        offWhiteColor: "#F9F9F9",
        grayColor: "#637381",
        darkGreen: "#118D57",
        lightGreen: "#C8FAD6",
        midGreen: "#00A76F",
        neonBlue: "#1F51FF",
        skyBlue: "#CCEDE2",
        midBlue: "#006C9C",
        redColor: "#EF4444",
        lightOrange: "#FFE3AA",
        lightBlue: "#AAE7F2",
        lightPink: "#FFC7BA",
        chocolate: "#332200",
        grayBlackColor: "#424242",
        tableHeadColor: "#CAF4FF",
        shinyBlackColor: "#212b36",
      },
      letterSpacing: {
        0.5: "0.125rem", // 0.125rem is equivalent to 0.5 letter spacing
      },
    },
    fontFamily: {
      // mon:["Montserrat","sans-serif"],
      mon: ["Rubik", "sans-serif"],
    },
    scrollbar: {
      width: "12px",
      track: "white", // Color for scrollbar track when not hovered
      thumb: "white", // Color for scrollbar thumb when not hovered
      hover: {
        track: "gray-300", // Color for scrollbar track when hovered
        thumb: "gray-500", // Color for scrollbar thumb when hovered
      },
    },
    radio: {
      base: "form-radio",
      checked: "form-radio checked text-white", // Add white color when checked
    },
  },
  plugins: [require("daisyui")],
};
