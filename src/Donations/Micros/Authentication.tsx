import React, { ReactElement } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { apiRequest } from "../../Utils/api";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import { useTranslation } from "next-i18next";
import { ThemeContext } from "../../../styles/themeContext";
import { Backdrop, Fade, Modal } from "@material-ui/core";
import VerifyEmailIcon from "../../../public/assets/icons/VerifyEmailIcon";
import GmailIcon from "../../../public/assets/icons/GmailIcon";
import OutlookIcon from "../../../public/assets/icons/OutlookIcon";
import AppleMailIcon from "../../../public/assets/icons/AppleMailIcon";
import getImageUrl from "../../Utils/getImageURL";
import { useRouter } from "next/dist/client/router";

interface Props {}

function Authentication({}: Props): ReactElement {
  const { setContactDetails, setshowErrorCard, setqueryToken, queryToken } =
    React.useContext(QueryParamContext);
  const {
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    user,
  } = useAuth0();

  const [profile, setprofile] = React.useState<null | Object>(null);
  const [openVerifyEmailModal, setopenVerifyEmailModal] = React.useState(false);

  const loadUserProfile = async () => {
    if ((user && user.email_verified) || queryToken) {
      try {
        // if we have access token in the query params we use it instead of using the 
        const token = queryToken ? queryToken : await getAccessTokenSilently();
        const requestParams = {
          url: "/app/profile",
          token: token,
          setshowErrorCard,
        };
        const profile: any = await apiRequest(requestParams);
        if (profile.data) {
          setprofile(profile.data);
          const newContactDetails = {
            firstname: profile.data.firstname ? profile.data.firstname : "",
            lastname: profile.data.lastname ? profile.data.lastname : "",
            email: profile.data.email ? profile.data.email : "",
            address: profile.data.address.address
              ? profile.data.address.address
              : "",
            city: profile.data.address.city ? profile.data.address.city : "",
            zipCode: profile.data.address.zipCode
              ? profile.data.address.zipCode
              : "",
            country: profile.data.address.country
              ? profile.data.address.country
              : "",
            companyname: "",
          };
          setContactDetails(newContactDetails);
        }
      } catch (err) {
        // console.log(err);
      }
    } else {
      setopenVerifyEmailModal(true);
    }
  };
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Fetch the profile data
      loadUserProfile();
      if (localStorage.getItem("queryparams")) {
        const queryparams = localStorage.getItem("queryparams");
        router.push(queryparams);
        localStorage.removeItem("queryparams");
      }
      // If details present store in contact details
      // If details are not present show message and logout user
    } else if (queryToken) {
      loadUserProfile();
    }
  }, [isAuthenticated, isLoading, queryToken]);

  const { t, ready } = useTranslation("common");

  const loginUser = () => {
    localStorage.setItem("queryparams", router.asPath);
    loginWithRedirect({
      redirectUri: window?.location.href,
      ui_locales: localStorage.getItem("language") || "en",
    });
  };

  React.useEffect(() => {
    // if there is token in the query params use it
    if (router.query.token) {
      setqueryToken(router.query.token);
      // If user is logged in via auth0, log them out
      if (!isLoading && isAuthenticated) {
        logout({ returnTo: window?.location.href })
      }
    }
  }, [router.query,isLoading,isAuthenticated]);
  
  return (
    <div>
      {!queryToken && !isLoading && !isAuthenticated && (
        <div className="w-100 d-flex" style={{ justifyContent: "flex-end" }}>
          <button onClick={() => loginUser()} className="login-continue">
            {t("loginContinue")}
          </button>
        </div>
      )}

      {(!isLoading && isAuthenticated && profile) || (queryToken && profile) ? (
        <div className="d-flex row justify-content-between w-100 mb-20">
          <a
            href={`https://www1.plant-for-the-planet.org/t/${profile.slug}`}
            target={"_blank"}
            className="user-profile"
          >
            {profile.image ? (
              <img
                className="profile-pic"
                src={getImageUrl("profile", "avatar", profile.image)}
                alt={profile ? profile.displayName :user.name}
              />
            ) : user.picture ? (
              <img className="profile-pic" src={user.picture} alt={user.name} />
            ) : (
              <div className="profile-pic no-pic">{user.name.charAt(0)}</div>
            )}
            <p>{profile ? profile.displayName : user.name}</p>
          </a>
          <button
            className="login-continue"
            onClick={() => logout({ returnTo: window?.location.href })}
          >
            {t("logout")}
          </button>
        </div>
      ):<></>}
      <VerifyEmailModal
        logout={logout}
        openModal={openVerifyEmailModal}
        handleModalClose={() => setopenVerifyEmailModal(false)}
      />
    </div>
  );
}

export default Authentication;

interface VerifyEmailProps {
  openModal: boolean;
  handleModalClose: Function;
  logout: Function;
}

function VerifyEmailModal({
  openModal,
  handleModalClose,
  logout,
}: VerifyEmailProps) {
  const { t, ready } = useTranslation("common");

  const { theme } = React.useContext(ThemeContext);

  return ready ? (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={"modal-container " + theme}
      open={openModal}
      onClose={handleModalClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      disableBackdropClick
    >
      <Fade in={openModal}>
        <div className={"modal p-20"}>
          <p className={"select-language-title mb-20"}>
            {t("verifyEmailHeader")}
          </p>
          <VerifyEmailIcon />
          <p className="text-center mt-30">{t("verifyEmailText")}</p>
          <p className="text-center mt-20">{t("verifyEmailInfo")}</p>
          <div className={"mt-30 d-flex column"}>
            <div
              className={
                "d-flex row w-100 justify-content-center align-items-center mailing-buttons"
              }
            >
              <a
                href="https://mail.google.com/"
                rel="noreferrer"
                target="_blank"
              >
                <GmailIcon />
              </a>
              <a
                href="https://www.icloud.com/mail"
                target="_blank"
                rel="noreferrer"
              >
                <AppleMailIcon />
              </a>
              <a
                href="https://outlook.office.com/mail/"
                target="_blank"
                rel="noreferrer"
              >
                <OutlookIcon />
              </a>
            </div>
            <button
              id={"VerifyEmailModalCan"}
              className={"secondary-button mt-20"}
              style={{ minWidth: "130px" }}
              onClick={() => logout({ returnTo: `${process.env.APP_URL}/` })}
            >
              <p>{t("skipLogout")}</p>
            </button>
          </div>
        </div>
      </Fade>
    </Modal>
  ) : null;
}
