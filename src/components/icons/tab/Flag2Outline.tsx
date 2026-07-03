import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgFlag2Outline = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="#2C2C2C"
      d="M5 22V3h16l-2 5 2 5H7v9zm2-11h11.05l-1.2-3 1.2-3H7z"
    />
  </Svg>
);
export default SvgFlag2Outline;
