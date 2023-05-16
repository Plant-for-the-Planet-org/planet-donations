import { useRouter } from "next/router";
import BackButtonIcon from "public/assets/icons/BackButtonIcon";
import { ReactElement } from "react";
import styles from "./BackButton.module.scss";

interface Props {
  backUrl: string;
}

const BackButton = ({ backUrl }: Props): ReactElement => {
  const router = useRouter();

  const goBack = () => {
    router.push(backUrl);
  };

  return (
    <button className={styles["back-button"]} onClick={goBack}>
      <BackButtonIcon />
    </button>
  );
};

export default BackButton;
