import React, { ReactElement } from "react";

interface Props {
  color: string;
}

function BackButton({ color }: Props): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="17.544"
      viewBox="0 0 18 17.544"
    >
      <path
        id="Icon_awesome-arrow-down"
        data-name="Icon awesome-arrow-down"
        d="M16.766,9.9l.892.892a.96.96,0,0,1,0,1.362l-7.806,7.81a.96.96,0,0,1-1.362,0L.68,12.157a.96.96,0,0,1,0-1.362L1.572,9.9a.965.965,0,0,1,1.378.016L7.562,14.76V3.214a.962.962,0,0,1,.964-.964H9.812a.962.962,0,0,1,.964.964V14.76l4.612-4.841A.958.958,0,0,1,16.766,9.9Z"
        transform="translate(20.25 -0.397) rotate(90)"
        fill={color ? color : "#2f3336"}
      />
    </svg>
  );
}

export default BackButton;
