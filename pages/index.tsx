import React, { ReactElement } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import MaterialTextField from "./../src/Common/InputTypes/MaterialTextField";
interface Props {}

function index({}: Props): ReactElement {
  const [session, loading] = useSession();

  return (
    <div> 
      {!session && (
        <>
          Not signed in <br />
          <button className={"primaryButton"} onClick={() => signIn()}>
            Sign in
          </button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
      <MaterialTextField label={"New input"} variant="outlined" name="name" />
    </div>
  );
}

export default index;
