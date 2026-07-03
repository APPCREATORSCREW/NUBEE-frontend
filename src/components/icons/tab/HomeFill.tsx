import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHomeFill = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="#F7D66E"
      d="M4 19v-9q0-.476.213-.9t.587-.7l6-4.5q.525-.4 1.2-.4t1.2.4l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413A1.92 1.92 0 0 1 18 21h-3a.97.97 0 0 1-.712-.288A.97.97 0 0 1 14 20v-5a.97.97 0 0 0-.288-.712A.97.97 0 0 0 13 14h-2a.97.97 0 0 0-.712.288A.97.97 0 0 0 10 15v5a.97.97 0 0 1-.288.713A.96.96 0 0 1 9 21H6q-.824 0-1.412-.587A1.93 1.93 0 0 1 4 19"
    />
  </Svg>
);
export default SvgHomeFill;
