import * as React from "react";
import Svg, { G, Path, Defs } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
import type { SvgProps } from "react-native-svg";
const SvgToggleOn = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={46}
    height={27}
    fill="none"
    {...props}
  >
    <G filter="url(#toggle-on_svg__a)">
      <Path
        fill="#F7D66E"
        fillRule="evenodd"
        d="M13.417 25q-4.792 0-8.146-3.354T1.917 13.5 5.27 5.354 13.417 2h19.166q4.792 0 8.146 3.354t3.354 8.146-3.354 8.146T32.583 25zm24.916-11.5q0 2.396-1.677 4.073t-4.073 1.677-4.073-1.677-1.677-4.073 1.677-4.073 4.073-1.677 4.073 1.677 1.677 4.073"
        clipRule="evenodd"
      />
    </G>
    <Defs></Defs>
  </Svg>
);
export default SvgToggleOn;
