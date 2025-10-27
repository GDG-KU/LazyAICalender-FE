import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const ViewConvertButton = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      fill="#2C2C2C"
      d="M2 20c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 0 18V4c0-.55.196-1.02.588-1.413A1.926 1.926 0 0 1 2 2h1V0h2v2h8V0h2v2h1c.55 0 1.02.196 1.413.587C17.803 2.98 18 3.45 18 4v14c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 16 20H2Zm0-2h14V8H2v10Z"
    />
  </Svg>
);
export default ViewConvertButton;
