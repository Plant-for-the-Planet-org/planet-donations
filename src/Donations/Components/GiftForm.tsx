import React, { ReactElement } from "react";
import { useForm } from "react-hook-form";
import MaterialTextField from "../../Common/InputTypes/MaterialTextField";
import { useTranslation } from "next-i18next";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import ToggleSwitch from "../../Common/InputTypes/ToggleSwitch";
import CloseIcon from "../../../public/assets/icons/CloseIcon";
interface Props {
  showGiftForm:boolean;
  setshowGiftForm:Function;
}

export default function GiftForm({showGiftForm,setshowGiftForm}: Props): ReactElement {
  const { t } = useTranslation("common");

  const { giftDetails, setgiftDetails, isGift, setisGift } = React.useContext(
    QueryParamContext
  );

  const defaultDeails = {
    recipientName: giftDetails.recipientName,
    email: giftDetails.email,
    giftMessage: giftDetails.giftMessage,
  };

  const { register, errors, handleSubmit } = useForm({
    mode: "all",
    defaultValues: defaultDeails,
  });

  React.useEffect(() => {
    if (isGift && giftDetails) {
      setgiftDetails({ ...giftDetails, type: "invitation" });
      setshowGiftForm(false)
    } else {
      setgiftDetails({ ...giftDetails, type: null });
    }
  }, [isGift]);

  const onSubmit = (data: any) => {
    setgiftDetails({ ...giftDetails, ...data });
    setshowGiftForm(false)
  };


  return (
    <div>
      {showGiftForm ? (
        <div>
          <div className="donations-gift-toggle">
            <label htmlFor="show-gift-form-toggle">
              My donation is a gift to someone
            </label>
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
                name={"email"}
                label={t("email")}
                variant="outlined"
                inputRef={register({
                  required: true,
                  pattern: /^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/i,
                })}
              />
              {errors.email && (
                <span className={"form-errors"}>{t("emailRequired")}</span>
              )}
            </div>
            <div className={"form-field mt-30"}>
              <MaterialTextField
                multiline
                rowsMax="4"
                label={t("giftMessage")}
                variant="outlined"
                name={"giftMessage"}
                inputRef={register()}
              />
            </div>
            <button
              onClick={handleSubmit(onSubmit)}
              className="primary-button w-100 mt-30"
            >
              Save Gift Details
            </button>
          </div>
        </div>
      ) : (
        <div className="donation-supports-info mt-10">
          <p>This donation supports {giftDetails.recipientName}</p>
          <button onClick={()=>{setshowGiftForm(true)}}>
            <CloseIcon />
          </button>
        </div>
      )}
    </div>
  );
}
