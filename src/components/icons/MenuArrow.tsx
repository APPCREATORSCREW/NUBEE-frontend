import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMenuArrow = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      fill="#B3B3B3"
      d="M10.856 9 5.344 3.488a.88.88 0 0 1-.273-.667.94.94 0 0 1 .291-.665.92.92 0 0 1 .666-.281q.384 0 .666.281l5.756 5.775q.225.225.337.506T12.9 9t-.113.563a1.5 1.5 0 0 1-.337.506l-5.775 5.775a.87.87 0 0 1-.656.272.93.93 0 0 1-.657-.291.91.91 0 0 1-.28-.666.9.9 0 0 1 .28-.665z"
    />
  </Svg>
);
export default SvgMenuArrow;
