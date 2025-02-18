import React, { ReactElement } from "react";
import { useAuth0, User as AuthUser } from "@auth0/auth0-react";
import { apiRequest } from "../../Utils/api";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import { useTranslation } from "next-i18next";
import { ThemeContext } from "../../../styles/themeContext";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import Skeleton from "@mui/material/Skeleton";
import VerifyEmailIcon from "../../../public/assets/icons/VerifyEmailIcon";
import GmailIcon from "../../../public/assets/icons/GmailIcon";
import OutlookIcon from "../../../public/assets/icons/OutlookIcon";
import AppleMailIcon from "../../../public/assets/icons/AppleMailIcon";
import getImageUrl from "../../Utils/getImageURL";
import { useRouter } from "next/router";
import CloseIcon from "public/assets/icons/CloseIcon";
import { setCountryCode } from "src/Utils/setCountryCode";
import { validateToken } from "src/Utils/tokenActions";
import { APIError, handleError } from "@planet-sdk/common";
import { ContactDetails } from "@planet-sdk/common";
import { User } from "@planet-sdk/common/build/types/user";

function Authentication(): ReactElement {
  const {
    setContactDetails,
    setshowErrorCard,
    setqueryToken,
    queryToken,
    profile,
    setprofile,
    setIsSignedUp,
    hideLogin,
    setcurrency,
    setcountry,
    tenant,
    setErrors,
  } = React.useContext(QueryParamContext);
  const {
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    user: authUser,
  } = useAuth0();

  const [openVerifyEmailModal, setopenVerifyEmailModal] = React.useState(false);

  const loadUserProfile = async () => {
    // if we have access token in the query params we use it instead of using the
    const token = queryToken ? queryToken : await getAccessTokenSilently();
    if ((authUser && authUser.email_verified) || validateToken(token)) {
      try {
        const requestParams = {
          url: "/app/profile",
          token: token,
          setshowErrorCard,
          tenant,
        };
        const profileResponse: { data: User } = await apiRequest(requestParams);
        const profile = profileResponse.data;

        if (profile) {
          if (profile.currency) {
            setcurrency(profile.currency);
          }
          if (profile.address.country) {
            setCountryCode({
              setcountry,
              setcurrency,
              profileCountry: profile.address.country,
            });
          }
          setprofile(profile);
          setIsSignedUp(true);
          const newContactDetails: ContactDetails = {
            firstname: profile.firstname ? profile.firstname : "",
            lastname: profile.lastname ? profile.lastname : "",
            email: profile.email ? profile.email : "",
            address: profile.address.address ? profile.address.address : "",
            city: profile.address.city ? profile.address.city : "",
            zipCode: profile.address.zipCode ? profile.address.zipCode : "",
            country: profile.address.country ? profile.address.country : "",
            companyname: (profile.type !== "individual" && profile.name) || "",
            tin: "",
          };
          setContactDetails(newContactDetails);
        }
      } catch (err) {
        setErrors(handleError(err as APIError));
        const newContactDetails = {
          firstname: authUser?.nickname ? authUser.nickname : "",
          email: authUser?.email ? authUser.email : "",
        };
        const newProfile = {
          ...newContactDetails,
          displayName: authUser?.nickname ? authUser.nickname : "",
        };
        setprofile(newProfile); //TODOO - resolve TS warning
        setContactDetails((contactDetails) => {
          return { ...contactDetails, ...newContactDetails };
        });
      }
    } else {
      const newContactDetails = {
        firstname: authUser?.nickname ? authUser.nickname : "",
        email: authUser?.email ? authUser.email : "",
      };
      const newProfile = {
        ...newContactDetails,
        displayName: authUser?.nickname ? authUser.nickname : "",
      };
      setprofile(newProfile); //TODOO - resolve TS warning
      setContactDetails((contactDetails) => {
        return { ...contactDetails, ...newContactDetails };
      });
      // setopenVerifyEmailModal(true);
    }
  };
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Fetch the profile data
      loadUserProfile();
      // If details present store in contact details
      // If details are not present show message and logout user
    } else if (queryToken) {
      loadUserProfile();
    }
    const queryParams = { ...router.query };
    delete queryParams.token;
    router.replace({ query: queryParams });
  }, [isAuthenticated, isLoading, queryToken]);

  const { t, i18n } = useTranslation("common");

  const loginUser = () => {
    const redirectPath = `/${router.locale}${router.asPath}`;
    localStorage.setItem("redirectPath", redirectPath);
    loginWithRedirect({
      redirectUri: `${process.env.APP_URL}/auth`,
      ui_locales: i18n.language || "en",
    });
  };

  const logoutUser = () => {
    const redirectPath = `/${router.locale}${router.asPath}`;
    localStorage.setItem("redirectPath", redirectPath);
    logout({ returnTo: `${process.env.APP_URL}/auth` });
  };

  React.useEffect(() => {
    // if there is token in the query params use it
    if (
      (router.query.token && validateToken(router.query.token as string)) ||
      validateToken(queryToken as string)
    ) {
      setqueryToken((router.query.token as string | null) || queryToken);
      // If user is logged in via auth0, log them out
      if (!isLoading && isAuthenticated) {
        logoutUser();
      }
    } else {
      setqueryToken("");
    }
  }, [router.query, isLoading, isAuthenticated]);
  return (
    <div>
      {isLoading ? (
        <div className="w-100 d-flex" style={{ justifyContent: "flex-end" }}>
          <Skeleton variant="rectangular" width={100} height={30} />
        </div>
      ) : !queryToken && !isLoading && !isAuthenticated ? (
        !hideLogin ? (
          <div className="w-100 d-flex" style={{ justifyContent: "flex-end" }}>
            <button onClick={() => loginUser()} className="login-continue">
              {t("loginContinue")}
            </button>
          </div>
        ) : (
          <div className="w-100 d-flex" style={{ justifyContent: "flex-end" }}>
            <button
              onClick={() => setopenVerifyEmailModal(true)}
              className="login-continue"
            >
              {t("verifyYourEmail")}
            </button>
          </div>
        )
      ) : (!isLoading && isAuthenticated && profile) || profile?.displayName ? (
        <div className="d-flex row justify-content-between w-100 mb-20">
          {!profile?.isPrivate ? (
            <a
              href={`https://web.plant-for-the-planet.org/t/${profile?.slug}`}
              target={"_blank"}
              rel="noreferrer"
            >
              <UserProfile profile={profile} authUser={authUser} />
            </a>
          ) : (
            <UserProfile profile={profile} authUser={authUser} />
          )}
          {authUser || profile ? (
            <button className="login-continue" onClick={() => logoutUser()}>
              {t("logout")}
            </button>
          ) : null}
        </div>
      ) : (
        <div className="w-100 d-flex" style={{ justifyContent: "flex-end" }}>
          <Skeleton variant="rectangular" width={100} height={30} />
        </div>
      )}
      <VerifyEmailModal
        logoutUser={logoutUser}
        openModal={openVerifyEmailModal}
        handleModalClose={() => setopenVerifyEmailModal(false)}
      />
    </div>
  );
}

export default Authentication;

interface VerifyEmailProps {
  openModal: boolean;
  handleModalClose: () => void;
  logoutUser: () => void;
}

function VerifyEmailModal({
  openModal,
  handleModalClose,
  logoutUser,
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
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={openModal}>
        <div className={"modal p-20"}>
          <button
            id={"thank-you-close"}
            onClick={handleModalClose}
            className="close-icon"
          >
            <CloseIcon
              color={theme === "theme-light" ? "#2f3336" : "#ffffff"}
            />
          </button>
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
              onClick={() => logoutUser()}
            >
              <p>{t("skipLogout")}</p>
            </button>
          </div>
        </div>
      </Fade>
    </Modal>
  ) : null;
}

interface UserProfileProps {
  profile: User;
  authUser?: AuthUser;
}
function UserProfile({ profile, authUser }: UserProfileProps) {
  return (
    <div className="user-profile">
      {profile.image ? (
        <img
          className="profile-pic"
          src={getImageUrl("profile", "avatar", profile.image)}
          alt={profile ? profile.displayName : authUser?.name}
        />
      ) : authUser?.picture ? (
        <img
          className="profile-pic"
          src={authUser.picture}
          alt={authUser?.name}
        />
      ) : (
        <div className="profile-pic no-pic">
          {profile ? profile.displayName.charAt(0) : authUser?.name?.charAt(0)}
        </div>
      )}
      {profile.isPrivate ? (
        <div className="profile-name">
          {profile ? profile.displayName : authUser?.name}
        </div>
      ) : (
        <p>{profile ? profile.displayName : authUser?.name}</p>
      )}
    </div>
  );
}
