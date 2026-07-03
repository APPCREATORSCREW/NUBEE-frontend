import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
import type { SvgProps } from "react-native-svg";
const SvgToggleOn = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={46}
    height={46}
    fill="none"
    {...props}
  >
    <G clipPath="url(#toggle-on_svg__a)" filter="url(#toggle-on_svg__b)">
      <Path
        fill="#F7D66E"
        fillRule="evenodd"
        d="M13.417 34.5q-4.792 0-8.146-3.354T1.917 23t3.354-8.146 8.146-3.354h19.166q4.792 0 8.146 3.354T44.083 23t-3.354 8.146-8.146 3.354zM38.333 23q0 2.396-1.677 4.073t-4.073 1.677-4.073-1.677T26.833 23t1.677-4.073 4.073-1.677 4.073 1.677T38.333 23"
        clipRule="evenodd"
      />
    </G>
    <Defs>
      <ClipPath id="toggle-on_svg__a">
        <Path fill="#fff" d="M0 0h46v46H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default SvgToggleOn;
