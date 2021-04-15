import React, { ReactElement } from "react";

interface Props {}

function DownArrowIcon({}: Props): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8.996"
      height="5.301"
      viewBox="0 0 8.996 5.301"
    >
      <path
        id="Path_3007"
        data-name="Path 3007"
        d="M5.065.235a.8.8,0,0,0-1.135,0L.235,3.93a.8.8,0,0,0,0,1.135L3.93,8.76A.8.8,0,0,0,5.065,7.625L1.942,4.494,5.065,1.37A.809.809,0,0,0,5.065.235Z"
        transform="translate(0 5.301) rotate(-90)"
        fill="#2F3336"
      />
    </svg>
  );
}

export default DownArrowIcon;
