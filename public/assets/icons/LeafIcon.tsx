import React, { ReactElement } from "react";

export default function LeafIcon(): ReactElement {
  return (
    <svg
      id="leaf"
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 30 30"
    >
      <path
        id="mainLeaf"
        data-name="Path 9989"
        d="M29.953.421A.682.682,0,0,0,29.323,0C2.868,0,0,10.967,0,15.682,0,21.8,4.662,25.909,11.6,25.909c8.756,0,10.59-8.332,11.575-12.809A23.089,23.089,0,0,1,29.8,1.163.682.682,0,0,0,29.953.421Z"
        transform="translate(-0.004)"
        fill="#68b030"
      />
      <path
        id="leafStem"
        data-name="Path 9990"
        d="M.686,129.846A.682.682,0,0,1,0,129.164c0-4.054,7.03-17.062,18.112-22.432a.682.682,0,0,1,.595,1.227h0c-11.192,5.423-17.343,18.018-17.343,21.2A.682.682,0,0,1,.686,129.846Z"
        transform="translate(-0.004 -99.845)"
        fill="#007a49"
      />
    </svg>
  );
}
