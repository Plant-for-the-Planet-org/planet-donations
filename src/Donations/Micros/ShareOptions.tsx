import React, {
  ReactElement,
  RefObject,
  useContext,
  useEffect,
  useState,
} from "react";
import EmailIcon from "../../../public/assets/icons/share/Email";
import EmailSolid from "../../../public/assets/icons/share/EmailSolid";
import FacebookIcon from "../../../public/assets/icons/share/Facebook";
import TwitterIcon from "../../../public/assets/icons/share/Twitter";
import DownloadIcon from "../../../public/assets/icons/share/Download";
import DownloadSolid from "../../../public/assets/icons/share/DownloadSolid";
import InstagramIcon from "../../../public/assets/icons/share/Instagram";
import ReactDOM from "react-dom";
import domtoimage from "dom-to-image";
import { useTranslation } from "next-i18next";
import { QueryParamContext } from "src/Layout/QueryParamContext";
import { ContactDetails } from "@planet-sdk/common";

interface ShareOptionsProps {
  treeCount: string;
  sendRef: () => RefObject<HTMLDivElement>;
  donor?: ContactDetails;
}
const ShareOptions = ({
  treeCount,
  sendRef,
  donor,
}: ShareOptionsProps): ReactElement | null => {
  const { t, ready } = useTranslation(["common", "donate"]);
  const [urlToShare, setUrlToShare] = useState("");
  const { donation } = useContext(QueryParamContext);

  useEffect(() => {
    if (donation) {
      setUrlToShare(
        encodeURIComponent(`${window.location.origin}?context=${donation.id}`)
      );
    }
  }, [donation]);

  const titleToShare = ready ? t("donate:titleToShare") : "";
  const linkToShare = "";
  let textToShare = "";
  // donor may be undefined or empty for legacy donations or redeem
  if (donor && (donor.companyname || donor.firstname)) {
    textToShare = ready
      ? t("donate:textToShareLinkedin", {
          name: `${donor.companyname || donor.firstname}`,
        })
      : "";
  } else {
    textToShare = ready ? t("donate:textToShareForMe") : "";
  }

  const exportComponent = (
    node: RefObject<HTMLDivElement>,
    fileName: string
    // backgroundColor: string | null,
    // type: string
  ) => {
    const element = ReactDOM.findDOMNode(node.current);
    const options = {
      quality: 1,
    };
    if (element) {
      domtoimage
        .toJpeg(element, options)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = fileName;
          link.href = dataUrl;
          link.click();
        })
        .catch(function (error) {
          console.error("Image cannot be downloaded", error);
        });
    }
  };

  const exportComponentAsJPEG = (
    node: RefObject<HTMLDivElement>,
    fileName = `My_${treeCount}_tree_donation.jpeg`
    /* backgroundColor: string | null = null,
    type = "image/jpeg" */
  ) => {
    const modifiedFileName = fileName.replace(".", "");
    return exportComponent(node, modifiedFileName);
  };

  const openWindowLinks = (shareUrl: string) => {
    window.open(shareUrl, "_blank");
  };

  const [currentHover, setCurrentHover] = React.useState(-1);

  const shareClicked = (shareUrl: string) => {
    openWindowLinks(shareUrl);
  };

  return ready ? (
    <div
      className={"share-options"}
      onMouseOut={() => setCurrentHover(-1)}
      style={{ cursor: "pointer" }}
    >
      <button
        id={"shareButton"}
        onClick={() => {
          if (sendRef) {
            exportComponentAsJPEG(
              sendRef(),
              `My_${treeCount}_tree_donation.jpeg`
            );
          }
        }}
        onMouseOver={() => setCurrentHover(1)}
      >
        {currentHover === 1 ? (
          <DownloadSolid color={"backgroundColorDark"} />
        ) : (
          <DownloadIcon color={"backgroundColorDark"} />
        )}
      </button>

      <button
        id={"shareFacebook"}
        onClick={() =>
          donation &&
          shareClicked(
            `https://www.facebook.com/sharer.php?u=${urlToShare}&hashtag=%23StopTalkingStartPlanting`
          )
        }
        onMouseOver={() => donation && setCurrentHover(2)}
      >
        <FacebookIcon
          color={currentHover === 2 ? "#3b5998" : "backgroundColorDark"}
        />
      </button>

      <button
        id={"shareInstagram"}
        onMouseOver={() => setCurrentHover(3)}
        onClick={() =>
          shareClicked(`https://www.instagram.com/plantfortheplanet_official/`)
        }
      >
        <InstagramIcon
          color={currentHover === 3 ? "#dd217b" : "backgroundColorDark"}
        />
      </button>

      <button
        id={"shareTwitter"}
        onMouseOver={() => setCurrentHover(4)}
        onClick={() =>
          shareClicked(
            `https://twitter.com/intent/tweet?hashtags=StopTalkingStartPlanting,TrillionTrees&url=${linkToShare}&text=${textToShare}`
          )
        }
      >
        <TwitterIcon
          backGroundColor={currentHover === 4 ? "backgroundColorDark" : "#fff"}
          fontColor={currentHover === 4 ? "#fff" : "backgroundColorDark"}
        />
      </button>

      <button
        id={"shareMail"}
        onClick={() =>
          shareClicked(`mailto:?subject=${titleToShare}&body=${textToShare}`)
        }
        onMouseOver={() => setCurrentHover(5)}
      >
        {currentHover === 5 ? (
          <EmailSolid color={"backgroundColorDark"} />
        ) : (
          <EmailIcon color={"backgroundColorDark"} />
        )}
      </button>
    </div>
  ) : null;
};

export default ShareOptions;
