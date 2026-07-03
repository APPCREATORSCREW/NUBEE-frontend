import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgVisibilityOn = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      fill="#2C2C2C"
      d="M11.391 11.016q.984-.984.984-2.391 0-1.406-.984-2.39T9 5.25t-2.39.985-.985 2.39a3.25 3.25 0 0 0 .985 2.391A3.25 3.25 0 0 0 9 12q1.404-.003 2.391-.984m-3.825-.957a1.95 1.95 0 0 1-.591-1.434q0-.843.591-1.434Q8.157 6.601 9 6.6q.843 0 1.435.591.591.591.59 1.434a1.97 1.97 0 0 1-.59 1.435q-.59.592-1.435.59a1.96 1.96 0 0 1-1.434-.59m-3.553 2.662Q1.763 11.194.75 8.625q1.013-2.57 3.263-4.096A8.7 8.7 0 0 1 9 3q2.738 0 4.988 1.529t3.262 4.096q-1.012 2.569-3.262 4.097A8.68 8.68 0 0 1 9 14.25a8.7 8.7 0 0 1-4.987-1.528"
    />
  </Svg>
);
export default SvgVisibilityOn;
