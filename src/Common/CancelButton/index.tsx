import { useRouter } from "next/router";
import { ReactElement } from "react";
import styles from "./CancelButton.module.scss";
import CloseIcon from "@mui/icons-material/Close";

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
      <CloseIcon />
    </button>
  );
};

export default CancelButton;
