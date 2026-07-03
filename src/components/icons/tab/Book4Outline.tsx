import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBook4Outline = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="#2C2C2C"
      d="M6 22a2.9 2.9 0 0 1-2.125-.875A2.9 2.9 0 0 1 3 19V5q0-1.25.875-2.125A2.9 2.9 0 0 1 6 2h9q.825 0 1.413.588T17 4v12q0 .825-.587 1.413A1.92 1.92 0 0 1 15 18H6a.97.97 0 0 0-.712.288A.97.97 0 0 0 5 19q0 .424.288.713A.96.96 0 0 0 6 20h13V5q0-.424.288-.712A.97.97 0 0 1 20 4q.424 0 .713.288A.96.96 0 0 1 21 5v15q0 .825-.587 1.413A1.92 1.92 0 0 1 19 22zm3-6h6V4H9zm-2 0V4H6a.97.97 0 0 0-.712.288A.97.97 0 0 0 5 5v11.175q.25-.075.488-.125Q5.727 16 6 16z"
    />
  </Svg>
);
export default SvgBook4Outline;
