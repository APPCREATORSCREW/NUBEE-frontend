import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgEdit = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="#2C2C2C"
      d="M4 21a.97.97 0 0 1-.712-.288A.97.97 0 0 1 3 20v-2.425a1.98 1.98 0 0 1 .575-1.4L16.2 3.575q.3-.275.663-.425t.762-.15.775.15.65.45L20.425 5q.3.275.437.65T21 6.4q0 .4-.138.763a1.9 1.9 0 0 1-.437.662l-12.6 12.6a1.976 1.976 0 0 1-1.4.575zM17.6 7.8 19 6.4 17.6 5l-1.4 1.4z"
    />
  </Svg>
);
export default SvgEdit;
