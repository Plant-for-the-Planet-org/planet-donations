import { useRouter } from "next/router";
import { ReactElement, useContext } from "react";
import styles from "./CancelButton.module.scss";
import CloseIcon from "public/assets/icons/CloseIcon";
import { QueryParamContext } from "src/Layout/QueryParamContext";

interface Props {
  returnUrl: string;
}

const CancelButton = ({ returnUrl }: Props): ReactElement => {
  const router = useRouter();
  const { callbackUrl } = useContext(QueryParamContext);

  const cancelDonation = () => {
    router.push(returnUrl);
  };

  return (
    <button
      className={styles["cancel-button"]}
      onClick={cancelDonation}
      title={callbackUrl ? "Exit" : "Home"}
    >
      <CloseIcon color={"#000"} />
    </button>
  );
};

export default CancelButton;
