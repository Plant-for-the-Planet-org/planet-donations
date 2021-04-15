import React, { ReactElement } from "react";
import Link from "next/Link";
import Image from "next/image";
import DownArrowIcon from "../../public/assets/icons/DownArrowIcon";

interface Props {}

function Footer({}: Props): ReactElement {
  return (
    <div className="footer-container">
      <button>Cancel and return to the organisation</button>
      <div className="footer-links">
        <button>
          English
          <DownArrowIcon/>
        </button>
        <Link href="/privacy-terms">Privacy & Terms</Link>
        <Link href="/imprint">Imprint</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/faqs">FAQs</Link>
        <a rel="noreferrer" href="https://a.plant-for-the-planet.org/">
          <Image
            src="https://cdn.plant-for-the-planet.org/logo/svg/planet.svg"
            alt="Plant-for-the-Planet logo"
            width={33}
            height={34}
          />
        </a>
      </div>
    </div>
  );
}

export default Footer;
