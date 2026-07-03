import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPersonFill = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="#F7D66E"
      d="M9.175 10.825Q8 9.65 8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12t-2.825-1.175M4 18v-.8q0-.85.438-1.562A2.93 2.93 0 0 1 5.6 14.55a14.8 14.8 0 0 1 3.15-1.162 13.8 13.8 0 0 1 6.5 0q1.6.39 3.15 1.162.725.375 1.163 1.088T20 17.2v.8q0 .825-.587 1.413A1.92 1.92 0 0 1 18 20H6q-.824 0-1.412-.587A1.93 1.93 0 0 1 4 18"
    />
  </Svg>
);
export default SvgPersonFill;
