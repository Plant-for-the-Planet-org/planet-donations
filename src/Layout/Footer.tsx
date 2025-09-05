import React, { Dispatch, ReactElement, SetStateAction } from "react";
import DownArrowIcon from "../../public/assets/icons/DownArrowIcon";
import SunIcon from "../../public/assets/icons/SunIcon";
import MoonIcon from "../../public/assets/icons/MoonIcon";
import {
  Fade,
  FormControl,
  FormControlLabel,
  Modal,
  RadioGroup,
} from "@mui/material";
import { ThemeContext } from "../../styles/themeContext";
import GreenRadio from "../Common/InputTypes/GreenRadio";
import { QueryParamContext } from "./QueryParamContext";
import supportedLanguages from "../../supportedLanguages.json";
import getLanguageName from "../Utils/getLanguageName";
import { useTranslation } from "next-i18next";
import { useAuth0 } from "@auth0/auth0-react";
import themeProperties from "../../styles/themeProperties";
import { useRouter } from "next/router";
import UNEPLogo from "../../public/assets/icons/UNEPLogo";
import { getHostnameFromUrl } from "src/Utils/getHostnameFromUrl";

function Footer(): ReactElement {
  const [languageModalOpen, setlanguageModalOpen] = React.useState(false);

  const { callbackUrl, donationStep } = React.useContext(QueryParamContext);

  const { t, i18n, ready } = useTranslation(["common"]);

  const { theme } = React.useContext(ThemeContext);

  const showCancelAndReturn = Boolean(callbackUrl && donationStep !== 4);

  return ready ? (
    <div className="footer">
      <div className="footer-container">
        <DarkModeSwitch />
        {showCancelAndReturn ? (
          <a href={callbackUrl}>
            {t("cancelReturn", { domain: getHostnameFromUrl(callbackUrl) })}
          </a>
        ) : (
          <p></p>
        )}
        <div
          className={`footer-content ${
            showCancelAndReturn ? "centered-footer-content" : ""
          }`}
        >
          <div className="footer-links">
            {donationStep !== 2 && donationStep !== 3 && donationStep !== 4 && (
              <button
                onClick={() => setlanguageModalOpen(!languageModalOpen)}
                data-test-id="languageButton"
              >
                {`${getLanguageName(i18n.language)}`}
                <DownArrowIcon
                  color={
                    theme === "theme-light"
                      ? themeProperties.light.primaryFontColor
                      : themeProperties.dark.primaryFontColor
                  }
                />
              </button>
            )}
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
              href={`https://www.plant-for-the-planet.org/${i18n.language}/faq`}
            >
              {t("faqs")}
            </a>
            <div className="planet-unep-logo">
              <div>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.plant-for-the-planet.org/"
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
          languageModalOpen={
            languageModalOpen &&
            donationStep !== 2 &&
            donationStep !== 3 &&
            donationStep !== 4
          }
          setlanguageModalOpen={setlanguageModalOpen}
        />
      </div>
      <div style={{ paddingTop: "10px", paddingBottom: "10px" }}></div>
      <CookiePolicy />
    </div>
  ) : (
    <></>
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
  const { t, i18n, ready } = useTranslation(["common"]);
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
    localStorage.setItem("cookieNotice", showCookieNotice.toString());
  }, [showCookieNotice]);

  return showCookieNotice && ready ? (
    <div className={"cookie-policy"}>
      <div>
        {t("privacyPolicyNotice")}{" "}
        <a href={`https://pp.eco/legal/${i18n.language}/privacy`}>
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
  setlanguageModalOpen: Dispatch<SetStateAction<boolean>>;
}

function LanguageModal({
  languageModalOpen,
  setlanguageModalOpen,
}: ModalProps): ReactElement {
  const { theme } = React.useContext(ThemeContext);

  const router = useRouter();
  const { t, ready, i18n } = useTranslation(["common"]);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={"modal-container " + theme}
      open={languageModalOpen}
      onClose={() => setlanguageModalOpen(false)}
      closeAfterTransition
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={languageModalOpen}>
        <div className="modal p-20">
          <p className="select-language-title">
            {ready && t("selectLanguage")}
          </p>
          <FormControl component="fieldset" variant="standard">
            <RadioGroup
              aria-label="language"
              name="language"
              value={i18n.language}
              onChange={(event) => {
                const lang = event.target.value;
                const { pathname, query, asPath } = router;
                // set cookie to store user preferences
                document.cookie = `NEXT_LOCALE=${lang}; max-age=31536000; path=/`;
                // change just the locale and maintain all other route information including href's query
                router.push({ pathname, query }, asPath, { locale: lang });
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
