import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgToggleOff = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={46}
    height={46}
    fill="none"
    {...props}
  >
    <Path
      fill="#B3B3B3"
      d="M13.417 34.5q-4.792 0-8.146-3.354T1.917 23t3.354-8.146 8.146-3.354h19.166q4.792 0 8.146 3.354T44.083 23t-3.354 8.146-8.146 3.354zm4.073-7.427q1.677-1.677 1.677-4.073t-1.677-4.073-4.073-1.677-4.073 1.677T7.667 23t1.677 4.073 4.073 1.677 4.073-1.677"
    />
  </Svg>
);
export default SvgToggleOff;
