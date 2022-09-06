import React, { useContext, useEffect, useState } from "react";
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

interface ShareOptionsProps {
  treeCount: String;
  sendRef: any;
  donor: Object;
}
const ShareOptions = ({ treeCount, sendRef, donor }: ShareOptionsProps) => {
  const { t, ready } = useTranslation(["common", "donate"]);
  const [urlToShare, setUrlToShare] = useState("");
  const { donation } = useContext(QueryParamContext);

  useEffect(() => {
    if (donation) {
      setUrlToShare(
        encodeURIComponent(`${window.location.origin}?context=${donation!.id}`)
      );
    }
  }, [donation]);

  const titleToShare = ready ? t("donate:titleToShare") : "";
  const linkToShare = "";
  let textToShare = "";
  // donor may be undefined or empty for legacy donations or redeem
  if (donor && donor.name) {
    textToShare = ready
      ? t("donate:textToShareLinkedin", { name: `${donor.name}` })
      : "";
  } else {
    textToShare = ready ? t("donate:textToShareForMe") : "";
  }

  const exportComponent = (node, fileName, backgroundColor, type) => {
    const element = ReactDOM.findDOMNode(node.current);
    const options = {
      quality: 1,
    };
    domtoimage
      .toJpeg(element, options)
      .then((dataUrl) => {
        domtoimage.toJpeg(element, options).then((dataUrl) => {
          domtoimage.toJpeg(element, options).then((dataUrl) => {
            const link = document.createElement("a");
            link.download = fileName;
            link.href = dataUrl;
            link.click();
          });
        });
      })
      .catch(function (error) {
        console.error("Image cannot be downloaded", error);
      });
  };

  const exportComponentAsJPEG = (
    node,
    fileName = `My_${treeCount}_tree_donation.jpeg`,
    backgroundColor = null,
    type = "image/jpeg"
  ) => {
    const modifiedFileName = fileName.replace(".", "");
    return exportComponent(node, modifiedFileName, backgroundColor, type);
  };

  const openWindowLinks = (shareUrl) => {
    window.open(shareUrl, "_blank");
  };

  const [currentHover, setCurrentHover] = React.useState(-1);

  const shareClicked = (shareUrl) => {
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
            `https://www.facebook.com/sharer.php?u=${urlToShare}&quote=${textToShare}&hashtag=%23StopTalkingStartPlanting`,
            "_blank"
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
            `https://twitter.com/intent/tweet?hashtags=StopTalkingStartPlanting,TrillionTrees&via=trilliontrees&url=${linkToShare}&text=${textToShare}`
          )
        }
      >
        <TwitterIcon
          color={currentHover === 4 ? "#00acee" : "backgroundColorDark"}
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
