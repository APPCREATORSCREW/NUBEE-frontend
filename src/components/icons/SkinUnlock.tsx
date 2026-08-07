import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSkinUnlock = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={88}
    height={116}
    fill="none"
    {...props}
  >
    <Path
      fill="#B3B3B3"
      d="M11 38.5h49.5v-11q0-6.875-4.812-11.687Q50.874 11 44 11q-6.876 0-11.687 4.813Q27.5 20.625 27.5 27.5h-11q0-11.412 8.047-19.453Q32.593.006 44 0t19.459 8.047T71.5 27.5v11H77q4.537 0 7.772 3.234Q88.005 44.968 88 49.5v55q0 4.537-3.228 7.771T77 115.5H11q-4.538 0-7.766-3.229T0 104.5v-55q0-4.538 3.234-7.766T11 38.5m40.772 46.272Q55 81.537 55 77t-3.228-7.766Q48.543 66.006 44 66t-7.766 3.234T33 77t3.234 7.772T44 88t7.772-3.228"
    />
  </Svg>
);
export default SvgSkinUnlock;
