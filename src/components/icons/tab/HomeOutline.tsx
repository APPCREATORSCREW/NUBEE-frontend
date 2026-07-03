import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHomeOutline = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="#2C2C2C"
      d="M6 19h3v-5q0-.424.288-.712A.97.97 0 0 1 10 13h4q.425 0 .713.288T15 14v5h3v-9l-6-4.5L6 10zm-2 0v-9q0-.476.213-.9t.587-.7l6-4.5q.525-.4 1.2-.4t1.2.4l6 4.5q.375.275.588.7T20 10v9q0 .825-.588 1.413A1.92 1.92 0 0 1 18 21h-4a.97.97 0 0 1-.712-.288A.97.97 0 0 1 13 20v-5h-2v5a.97.97 0 0 1-.288.713A.96.96 0 0 1 10 21H6q-.824 0-1.412-.587A1.93 1.93 0 0 1 4 19"
    />
  </Svg>
);
export default SvgHomeOutline;
