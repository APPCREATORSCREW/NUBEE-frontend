import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCheckEnabled = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <Circle cx={8} cy={8} r={8} fill="#F7D66E" />
    <Path
      stroke="#FFFCF7"
      strokeLinecap="square"
      strokeWidth={2}
      d="M4 8.5 7 11l5.5-5"
    />
  </Svg>
);
export default SvgCheckEnabled;
