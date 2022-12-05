import React, { ReactElement } from "react";
import CloseIcon from "../../../public/assets/icons/CloseIcon";
import styles from "./ErrorPopup.module.scss";
import { useTranslation } from "next-i18next";
import { QueryParamContext } from "src/Layout/QueryParamContext";
import { SerializedError } from "@planet-sdk/common";

export default function ErrorPopup(): ReactElement {
  const { t, ready } = useTranslation(["common"]);
  const { errors, setErrors } = React.useContext(QueryParamContext);

  const handleRemoveError = (message: string) => {
    if (errors) {
      const updatedErrors = (errors as SerializedError[]).filter(
        (err: SerializedError) => err.message !== message
      );
      setErrors(updatedErrors);
    }
  };

  return (
    <>
      {ready &&
        errors &&
        (errors as SerializedError[]).length > 0 &&
        (errors as SerializedError[]).map((err: SerializedError) => {
          return (
            <div className={styles.errorContainer}>
              <button
                id={"errorCloseButton"}
                className={`${styles.closeButton}`}
                onClick={() => handleRemoveError(err.message)}
              >
                <CloseIcon color={"#fff"} width={"10"} height={"10"} />
              </button>
              <div className={styles.errorContent}>{t(err.message)}</div>
            </div>
          );
        })}
    </>
  );
}
