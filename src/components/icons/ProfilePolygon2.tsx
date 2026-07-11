import * as React from "react";
import Svg, { G, Path, Defs } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
import type { SvgProps } from "react-native-svg";
const SvgProfilePolygon2 = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={142}
    height={124}
    fill="none"
    {...props}
  >
    <G filter="url(#profile-polygon2_svg__a)">
      <Path
        fill="#F7D66E"
        d="M2 61.756 36.5 2h69L140 61.756l-34.5 59.756h-69z"
      />
    </G>
    <Defs></Defs>
  </Svg>
);
export default SvgProfilePolygon2;
