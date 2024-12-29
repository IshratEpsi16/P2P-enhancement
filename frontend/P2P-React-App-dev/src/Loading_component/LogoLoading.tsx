import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import loaderJson from "../jsons/loader.json";

export default function LogoLoading() {
  return (
    <div>
      <Player
        src={loaderJson}
        className="player"
        loop
        autoplay
        speed={1}
        style={{ height: "400px", width: "400px" }}
      />
    </div>
  );
}
