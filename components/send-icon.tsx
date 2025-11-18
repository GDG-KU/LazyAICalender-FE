import * as React from "react";

import Svg, {
  Defs,
  LinearGradient,
  Mask,
  Path,
  Stop,
  SvgProps,
} from "react-native-svg";
const SendIcon = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Mask id="b" fill="#fff">
      <Path d="M11.106 4.789 4.052 18.897c-.395.789.35 1.665 1.192 1.402L11 18.5l1-6.5 1 6.5 5.756 1.799c.841.263 1.587-.613 1.192-1.402L12.894 4.789a1 1 0 0 0-1.788 0Z" />
    </Mask>
    <Path
      fill="url(#a)"
      d="M11.106 4.789 4.052 18.897c-.395.789.35 1.665 1.192 1.402L11 18.5l1-6.5 1 6.5 5.756 1.799c.841.263 1.587-.613 1.192-1.402L12.894 4.789a1 1 0 0 0-1.788 0Z"
    />
    <Path
      fill="#000"
      d="m4.04 18.891.023.012 1.423-2.847 5.63-11.262c.31-.71 1.458-.71 1.767 0l7.054 14.109c.415.718-.402 1.678-1.178 1.384l-5.755-1.799.008.01-1-6.5h-.024l-1 6.5.008-.01-4.951 1.547-.805.252c-.775.294-1.592-.666-1.177-1.384l-.023-.012c-.425.737.413 1.721 1.208 1.42l.804-.252 4.952-1.547.007-.002.001-.008 1-6.5h-.024l1 6.5v.008l.008.002 5.756 1.799c.795.301 1.633-.683 1.208-1.42L12.906 4.783c-.318-.73-1.495-.73-1.812 0l-5.63 11.262L4.04 18.89Zm.023.012-.023-.012.023.012Z"
      mask="url(#b)"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={5.952}
        x2={18.407}
        y1={18.436}
        y2={5.743}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#F2A892" />
        <Stop offset={0.5} stopColor="#D79EBF" />
        <Stop offset={1} stopColor="#AC95F5" />
      </LinearGradient>
    </Defs>
  </Svg>
);
export default SendIcon;
