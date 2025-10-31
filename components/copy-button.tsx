import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const CopyButton = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      fill="#1F1F1F"
      d="M9.5 18c-.55 0-1.02-.196-1.412-.587A1.926 1.926 0 0 1 7.5 16V4c0-.55.196-1.02.588-1.413A1.926 1.926 0 0 1 9.5 2h9c.55 0 1.02.196 1.413.587.391.392.587.863.587 1.413v12c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 18.5 18h-9Zm-4 4c-.55 0-1.02-.196-1.412-.587A1.926 1.926 0 0 1 3.5 20V6h2v14h11v2h-11Z"
    />
  </Svg>
);
export default CopyButton;
