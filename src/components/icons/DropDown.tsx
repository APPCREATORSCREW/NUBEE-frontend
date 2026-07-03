import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDropDown = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="#F7D66E"
      fillRule="evenodd"
      d="M12 22a9.7 9.7 0 0 1-3.9-.788 10.1 10.1 0 0 1-3.175-2.137q-1.35-1.35-2.137-3.175A9.8 9.8 0 0 1 2 12q0-2.075.788-3.9a10.1 10.1 0 0 1 2.137-3.175Q6.273 3.575 8.1 2.788A9.7 9.7 0 0 1 12 2q2.073 0 3.9.788a10.1 10.1 0 0 1 3.175 2.137q1.348 1.35 2.138 3.175A9.7 9.7 0 0 1 22 12a9.8 9.8 0 0 1-.788 3.9 10 10 0 0 1-2.137 3.175 10.2 10.2 0 0 1-3.175 2.138A9.7 9.7 0 0 1 12 22m5.675-4.325Q15.35 20 12 20t-5.675-2.325T4 12t2.325-5.675T12 4t5.675 2.325T20 12t-2.325 5.675"
      clipRule="evenodd"
    />
    <Path
      fill="#F7D66E"
      fillRule="evenodd"
      d="M12 20q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4 6.325 6.325 4 12t2.325 5.675T12 20m0-5.2a.48.48 0 0 1-.35-.15l-2.8-2.8q-.25-.25-.125-.55T9.2 11h5.6q.35 0 .475.3t-.125.55l-2.8 2.8a.48.48 0 0 1-.35.15"
      clipRule="evenodd"
    />
  </Svg>
);
export default SvgDropDown;
