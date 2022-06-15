import React, { ReactElement } from "react";
import Image from "next/image";
import DownArrowIcon from "../../public/assets/icons/DownArrowIcon";
import SunIcon from "../../public/assets/icons/SunIcon";
import MoonIcon from "../../public/assets/icons/MoonIcon";
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
import getLanguageName from "../Utils/getLanguageName";
import { useTranslation } from "next-i18next";
import CloseIcon from "../../public/assets/icons/CloseIcon";
import { useAuth0 } from "@auth0/auth0-react";
import themeProperties from "../../styles/themeProperties";
import { apiRequest } from "src/Utils/api";
import { useRouter } from "next/router";
import UNEPLogo from "../../public/assets/icons/UNEPLogo";

interface Props {}

function Footer({}: Props): ReactElement {
  const [languageModalOpen, setlanguageModalOpen] = React.useState(false);

  const { callbackUrl, donationStep, language, setlanguage } =
    React.useContext(QueryParamContext);

  const { t, i18n, ready } = useTranslation(["common"]);

  const { theme } = React.useContext(ThemeContext);

  return (
    <div className="footer">
      <div className="footer-container">
        <DarkModeSwitch />
        {callbackUrl && donationStep !== 4 ? (
          <a href={callbackUrl}>{t("cancelReturn")}</a>
        ) : (
          <p></p>
        )}
        <div>
          <div className="footer-links">
            <button
              onClick={() => setlanguageModalOpen(!languageModalOpen)}
              data-test-id="languageButton"
            >
              {`${getLanguageName(language)}`}
              <DownArrowIcon
                color={
                  theme === "theme-light"
                    ? themeProperties.light.primaryFontColor
                    : themeProperties.dark.primaryFontColor
                }
              />
            </button>
            <a
              rel="noreferrer"
              target="_blank"
              href={`https://pp.eco/legal/${i18n.language}/privacy`}
            >
              {t("privacy")}
            </a>
            <a
              rel="noreferrer"
              target="_blank"
              href={`https://pp.eco/legal/${i18n.language}/terms`}
            >
              {t("terms")}
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://pp.eco/legal/${i18n.language}/imprint`}
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
              href={`https://a.plant-for-the-planet.org/${i18n.language}/faq`}
            >
              {t("faqs")}
            </a>
            <div className="planet-unep-logo">
              <div>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://a.plant-for-the-planet.org/"
                >
                  <img
                    src="https://cdn.plant-for-the-planet.org/logo/svg/planet.svg"
                    alt="Plant-for-the-Planet logo"
                    width={33}
                    height={34}
                  />
                </a>
              </div>
              <div>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.unep.org/"
                >
                  <UNEPLogo />
                </a>
              </div>
            </div>
          </div>
          <div className="planet-support-text">
            <p style={{ fontStyle: "italic" }}>{t("pfpSupportsUNEP")}</p>
          </div>
        </div>

        <LanguageModal
          languageModalOpen={languageModalOpen}
          setlanguageModalOpen={setlanguageModalOpen}
        />
      </div>
      <div style={{ paddingTop: "10px", paddingBottom: "10px" }}></div>
      <CookiePolicy />
    </div>
  );
}

function DarkModeSwitch() {
  const { theme, setTheme } = React.useContext(ThemeContext);

  return (
    <button style={{ position: "relative" }}>
      <input
        onClick={() =>
          setTheme(theme === "theme-light" ? "theme-dark" : "theme-light")
        }
        defaultChecked={theme === "theme-dark" ? true : false}
        type="checkbox"
        className="darkmodeCheckbox"
        id="chk"
      />
      <label className="darkmodeLabel" htmlFor="chk">
        <MoonIcon />
        <SunIcon />
        <div className="darkmodeBall"></div>
      </label>
    </button>
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
        data-test-id="cookieCloseButton"
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

  const { language, setlanguage, projectDetails, country, loadPaymentSetup } =
    React.useContext(QueryParamContext);

  const router = useRouter();
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
                localStorage.setItem("language", event.target.value);
                if (projectDetails && router.query.to) {
                  loadPaymentSetup({
                    projectGUID: router.query.to,
                    paymentSetupCountry: country,
                    shouldSetPaymentDetails: false,
                  });
                }
                router.query.locale = event.target.value;
                router.push(router);
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
