import React, { ReactElement } from "react";
import { useForm } from "react-hook-form";
import MaterialTextField from "../../Common/InputTypes/MaterialTextField";
import { useTranslation } from "next-i18next";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import ToggleSwitch from "../../Common/InputTypes/ToggleSwitch";
import CloseIcon from "../../../public/assets/icons/CloseIcon";
interface Props {}

export default function GiftForm({}: Props): ReactElement {
  const { t } = useTranslation("common");
  const [showEmail, setshowEmail] = React.useState(false);
  const { giftDetails, setgiftDetails, isGift, setisGift } =
    React.useContext(QueryParamContext);

  const defaultDeails = {
    recipientName: giftDetails.recipientName,
    recipientEmail: giftDetails.recipientEmail,
    giftMessage: giftDetails.giftMessage,
  };

  const { register, errors, handleSubmit, reset } = useForm({
    mode: "all",
    defaultValues: defaultDeails,
  });

  React.useEffect(() => {
    if (isGift && giftDetails) {
      setgiftDetails({ ...giftDetails, type: "invitation" });
    } else {
      setgiftDetails({ ...giftDetails, type: null });
    }
  }, [isGift]);

  const onSubmit = (data: any) => {
    setgiftDetails({ ...giftDetails, ...data });
  };

  const resetGiftForm = () => {
    const defaultDeails = {
      recipientName: "",
      email: "",
      giftMessage: "",
    };
    setgiftDetails(defaultDeails);
    reset(defaultDeails);
  };

  return (
    <div>
      {giftDetails && giftDetails.recipientName === "" ? (
        <div>
          <div className="donations-gift-toggle">
            <label htmlFor="show-gift-form-toggle">{t("giftSomeone")}</label>
            <ToggleSwitch
              name="show-gift-form-toggle"
              checked={isGift}
              onChange={() => {
                setisGift(!isGift);
              }}
              id="show-gift-form-toggle"
            />
          </div>
          <div
            className={`donations-gift-form ${isGift ? "" : "display-none"}`}
          >
            <div className={"form-field mt-20"}>
              <MaterialTextField
                name={"recipientName"}
                label={t("recipientName")}
                variant="outlined"
                inputRef={register({ required: true })}
              />
              {errors.recipientName && (
                <span className={"form-errors"}>
                  {t("recipientNameRequired")}
                </span>
              )}
            </div>

            <div className={"form-field mt-30"}>
              <MaterialTextField
                multiline
                rows="3"
                rowsMax="4"
                label={t("giftMessage")}
                variant="outlined"
                name={"giftMessage"}
                inputRef={register()}
              />
            </div>

            {showEmail ? (
              <div className={"form-field mt-30"}>
                <div className="d-flex row justify-content-between mb-10">
                  <p>{t("giftNotification")}</p>
                  <button
                    onClick={() => setshowEmail(false)}
                    className={"singleGiftRemove"}
                  >
                    {t("removeRecipient")}
                  </button>
                </div>

                <MaterialTextField
                  name={"recipientEmail"}
                  label={t("recipientEmail")}
                  variant="outlined"
                  inputRef={register({
                    required: true,
                    pattern:
                      /^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/i,
                  })}
                />
                {errors.recipientEmail && (
                  <span className={"form-errors"}>{t("emailRequired")}</span>
                )}
              </div>
            ) : (
              <div className={"form-field mt-30"}>
                <button
                  onClick={() => setshowEmail(true)}
                  className={"addEmailButton"}
                >
                  {t("addEmail")}
                </button>
              </div>
            )}
            <button
              onClick={handleSubmit(onSubmit)}
              className="primary-button w-100 mt-30"
            >
              {t("saveGiftDetails")}
            </button>
          </div>
        </div>
      ) : (
        <div className="donation-supports-info mt-10">
          <p>
            {t("directGiftRecipient", {
              name: giftDetails.recipientName,
            })}
          </p>
          <button onClick={() => resetGiftForm()}>
            <CloseIcon />
          </button>
        </div>
      )}
    </div>
  );
}
