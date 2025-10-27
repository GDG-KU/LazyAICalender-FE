import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

// 여기 이름 변경하기
const PlusText = (props: SvgProps) => (
  <Svg width={26} height={26} fill="none" {...props}>
    <Path
      fill="#fff"
      d="M11.957 14.043H6.745a1.042 1.042 0 1 1 0-2.085h5.212V6.744a1.042 1.042 0 1 1 2.085 0v5.212h5.213a1.042 1.042 0 1 1 0 2.085h-5.212v5.213a1.042 1.042 0 1 1-2.085 0v-5.212Z"
    />
  </Svg>
);
export default PlusText;
