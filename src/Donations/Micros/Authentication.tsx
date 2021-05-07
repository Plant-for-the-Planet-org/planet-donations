import React, { ReactElement } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getAuthenticatedRequest } from "../../Utils/api";
import { QueryParamContext } from "../../Layout/QueryParamContext";

interface Props {}

function Authentication({}: Props): ReactElement {
  const { setContactDetails } = React.useContext(QueryParamContext);
  const {
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  const [profile, setprofile] = React.useState<null | Object>(null);

  const loadUserProfile = async () => {
    const token = await getAccessTokenSilently();

    try {
      const profile: any = await getAuthenticatedRequest("/app/profile", token);
      if (profile.data) {
        setprofile(profile.data);
        const newContactDetails = {
          firstname: profile.data.firstname ? profile.data.firstname : '',
          lastname: profile.data.lastname? profile.data.lastname : '',
          email: profile.data.email? profile.data.email : '',
          address: profile.data.address.address? profile.data.address.address : '',
          city: profile.data.address.city? profile.data.address.city : '',
          zipCode: profile.data.address.zipCode? profile.data.address.zipCode : '',
          country: profile.data.address.country? profile.data.address.country : '',
          companyname: "",
        };
        setContactDetails(newContactDetails);
      }
    } catch (err) {
      // console.log(err);
    }
  };

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Fetch the profile data
      loadUserProfile();
      // If details present store in contact details
      // If details are not present show message and logout user
    }
  }, [isAuthenticated, isLoading]);

  return (
    <div>
      {!isLoading && !isAuthenticated && (
        <button
          className="login-continue"
          onClick={() =>
            loginWithRedirect({
              redirectUri: `${process.env.NEXTAUTH_URL}`,
              ui_locales: localStorage.getItem("locale") || "en",
            })
          }
        >
          Login & Continue
        </button>
      )}

      {!isLoading && isAuthenticated && (
        <button className="login-continue" onClick={() =>  logout({ returnTo: `${process.env.NEXTAUTH_URL}/` })}>
          Logout
        </button>
      )}
    </div>
  );
}

export default Authentication;
