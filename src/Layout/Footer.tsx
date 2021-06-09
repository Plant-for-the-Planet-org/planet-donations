import React, { ReactElement } from "react";
import Image from "next/image";
import DownArrowIcon from "../../public/assets/icons/DownArrowIcon";
import {
  Backdrop,
  Fade,
  FormControl,
  FormControlLabel,
  Modal,
  RadioGroup,
} from "@material-ui/core";
import { ThemeContext } from "../../styles/themeContext";
import GreenRadio from "../Common/InputTypes/GreenRadio";
import { QueryParamContext } from "./QueryParamContext";
import supportedLanguages from "../../supportedLanguages.json";
import getLanguageName from '../Utils/getLanguageName';
import { useTranslation } from "next-i18next";
import CloseIcon from "../../public/assets/icons/CloseIcon";
import { useAuth0 } from "@auth0/auth0-react";

interface Props {}

function Footer({}: Props): ReactElement {
  const [languageModalOpen, setlanguageModalOpen] = React.useState(false);
  const { language, setlanguage } = React.useContext(QueryParamContext);

  const { returnTo } = React.useContext(QueryParamContext);
  const { t, ready } = useTranslation(["common"]);

  return (
    <div className="footer">
      <div className="footer-container">
        {returnTo ? <a href={returnTo}>{t("cancelReturn")}</a> : <p></p>}

        <div className="footer-links">
          <button onClick={() => setlanguageModalOpen(!languageModalOpen)}>
            {`${getLanguageName(language)}`}
            <DownArrowIcon />
          </button>
          <a
            rel="noreferrer"
            target="_blank"
            href="https://a.plant-for-the-planet.org/privacy-terms"
          >
            {t("privacyTerms")}
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://a.plant-for-the-planet.org/imprint"
          >
            {t("imprint")}
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="mailto:support@plant-for-the-planet.org"
          >
            {t("contact")}
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://a.plant-for-the-planet.org/faq"
          >
            {t("faqs")}
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://a.plant-for-the-planet.org/"
          >
            <Image
              src="https://cdn.plant-for-the-planet.org/logo/svg/planet.svg"
              alt="Plant-for-the-Planet logo"
              width={33}
              height={34}
            />
          </a>
        </div>
        <LanguageModal
          languageModalOpen={languageModalOpen}
          setlanguageModalOpen={setlanguageModalOpen}
        />
      </div>
      <CookiePolicy />
    </div>
  );
}

function CookiePolicy() {
  const { t, ready } = useTranslation(["common"]);
  const [showCookieNotice, setShowCookieNotice] = React.useState(false);

  const { isLoading, isAuthenticated } = useAuth0();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setShowCookieNotice(false);
    }
  }, [isAuthenticated, isLoading]);

  React.useEffect(() => {
    const prev = localStorage.getItem("cookieNotice");
    if (!prev) {
      setShowCookieNotice(true);
    } else {
      setShowCookieNotice(prev === "true");
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem("cookieNotice", showCookieNotice);
  }, [showCookieNotice]);

  return showCookieNotice ? (
    <div className={"cookie-policy"}>
      <div>
        {t("privacyPolicyNotice")}{" "}
        <a href="https://www.plant-for-the-planet.org/en/footermenu/privacy-policy">
          {t("privacyPolicy")}
        </a>
      </div>
      <button
        id={"cookieCloseButton"}
        onClick={() => setShowCookieNotice(false)}
        className="primary-button mt-20"
      >
        {t("acceptClose")}
      </button>
    </div>
  ) : (
    <></>
  );
}

interface ModalProps {
  languageModalOpen: boolean;
  setlanguageModalOpen: Function;
}

function LanguageModal({
  languageModalOpen,
  setlanguageModalOpen,
}: ModalProps): ReactElement {
  const { theme } = React.useContext(ThemeContext);

  const { language, setlanguage } = React.useContext(QueryParamContext);
  const { t, ready } = useTranslation(["common"]);
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={"modal-container " + theme}
      open={languageModalOpen}
      onClose={() => setlanguageModalOpen(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={languageModalOpen}>
        <div className="modal p-20">
          <p className="select-language-title">{t("selectLanguage")}</p>
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="language"
              name="language"
              value={language}
              onChange={(event) => {
                setlanguage(event.target.value);
                setlanguageModalOpen(false);
              }}
            >
              {supportedLanguages.map((lang) => (
                <FormControlLabel
                  key={lang.langCode}
                  value={lang.langCode}
                  control={<GreenRadio />}
                  label={lang.languageName}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </div>
      </Fade>
    </Modal>
  );
}

export default Footer;
