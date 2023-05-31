import { ReactElement } from "react";
import { useTranslation } from "next-i18next";
import { ContactDetails } from "@planet-sdk/common/build/types/donation";
import styles from "./LeftPanel.module.scss";

interface Props {
  contactDetails: ContactDetails;
}
const ContactDetailsInfo = ({ contactDetails }: Props): ReactElement => {
  const { t } = useTranslation("common");
  const { firstname, lastname, email, address, city, zipCode, country, tin } =
    contactDetails;

  // As we only see this after updating filling up the contact form, no checks are done for field length.
  return (
    <div className={`${styles["contact-details-info"]}`}>
      <p>{t("billingAddress")}</p>
      <p className={styles["donor-name"]}>
        {firstname} {lastname}{" "}
      </p>
      <p>{email}</p>
      <p>
        {address}
        {", "}
        {city}
        {", "}
        {zipCode}
      </p>
      <p>{t(`country:${country.toLowerCase()}`)}</p>
      {tin !== null && tin.length > 0 && (
        <p>
          {t("common:tinText")} {tin}
        </p>
      )}
    </div>
  );
};
export default ContactDetailsInfo;
