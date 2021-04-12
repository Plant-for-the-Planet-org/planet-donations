import React, { ReactElement } from "react";
import { signIn, signOut, useSession } from "next-auth/client";
import MaterialTextField from "./../src/Common/InputTypes/MaterialTextField";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useForm } from "react-hook-form";
import Donations from './../src/Donations'
interface Props {}

function index({}: Props): ReactElement {
  const [session, loading] = useSession();
  const { t } = useTranslation("common");
  const { register, handleSubmit, watch, errors } = useForm({ mode: 'all'});
  
  return (
    <div>
      {/* {!session && (
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
      )} */}
      <Donations/>
    </div>
  );
}

export default index;

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});
