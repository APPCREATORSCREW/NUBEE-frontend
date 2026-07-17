import * as React from "react";
import Svg, { G, Path, Defs } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
import type { SvgProps } from "react-native-svg";
const SvgToggleOff = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={46}
    height={27}
    fill="none"
    {...props}
  >
    <G filter="url(#toggle-off_svg__a)">
      <Path
        fill="#B3B3B3"
        d="M13.417 25q-4.792 0-8.146-3.354T1.917 13.5 5.27 5.354 13.417 2h19.166q4.792 0 8.146 3.354t3.354 8.146-3.354 8.146T32.583 25zm4.073-7.427q1.677-1.677 1.677-4.073T17.49 9.427 13.417 7.75 9.344 9.427 7.667 13.5t1.677 4.073 4.073 1.677 4.073-1.677"
      />
    </G>
    <Defs></Defs>
  </Svg>
);
export default SvgToggleOff;
