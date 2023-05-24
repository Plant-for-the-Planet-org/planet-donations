import { useRouter } from "next/router";
import { ReactElement } from "react";
import styles from "./CancelButton.module.scss";
import CloseIcon from "public/assets/icons/CloseIcon";

interface Props {
  returnUrl: string;
}

const CancelButton = ({ returnUrl }: Props): ReactElement => {
  const router = useRouter();

  const cancelDonation = () => {
    router.push(returnUrl);
  };

  return (
    <button className={styles["cancel-button"]} onClick={cancelDonation}>
      <CloseIcon color={"#000"} />
    </button>
  );
};

export default CancelButton;
