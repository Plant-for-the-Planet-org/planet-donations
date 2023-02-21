import React, { ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import MaterialTextField from "../../Common/InputTypes/MaterialTextField";
import InputAdornment from "@mui/material/InputAdornment";
import { useTranslation } from "next-i18next";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import ToggleSwitch from "../../Common/InputTypes/ToggleSwitch";
import { useRouter } from "next/router";
import { DefaultGift } from "src/Common/Types";
import GiftIcon from "public/assets/icons/GiftIcon";

type GiftFormData = {
  recipientName: string;
  recipientEmail: string;
  message: string;
};

export default function GiftForm(): ReactElement {
  const { t } = useTranslation("common");
  const [showEmail, setshowEmail] = React.useState(false);
  const { giftDetails, setgiftDetails, isGift, setisGift } =
    React.useContext(QueryParamContext);

  const defaultDetails: GiftFormData = {
    // TODOO - resolve donation/gift related TS warnings
    recipientName: giftDetails.recipientName,
    recipientEmail: giftDetails.recipientEmail,
    message: giftDetails.message,
  };

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<GiftFormData>({
    mode: "all",
    defaultValues: defaultDetails,
  });

  React.useEffect(() => {
    if (isGift && giftDetails) {
      if (giftDetails.type !== "direct") {
        setgiftDetails((giftDetails) => {
          return { ...giftDetails, type: "invitation" };
        });
      }
    } else {
      setgiftDetails((giftDetails) => {
        return { ...(giftDetails as DefaultGift), type: null };
      });
    }
  }, [isGift]);

  const onSubmit = (data: GiftFormData) => {
    setgiftDetails((giftDetails) => {
      return { ...giftDetails, ...data, type: "invitation" };
    });
  };

  const resetGiftForm = () => {
    const _defaultDetails: Readonly<DefaultGift> = {
      recipientName: "",
      recipientEmail: "",
      message: "",
      type: null,
    };
    setgiftDetails(_defaultDetails);
    reset(_defaultDetails);
  };

  const router = useRouter();

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
                setisGift((isGift) => !isGift);
              }}
              id="show-gift-form-toggle"
            />
          </div>
          <div
            className={`donations-gift-form ${isGift ? "" : "display-none"}`}
          >
            <div className={"form-field mt-20"}>
              <Controller
                name="recipientName"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <MaterialTextField
                    onChange={onChange}
                    value={value}
                    label={t("recipientName")}
                    variant="outlined"
                    data-test-id="recipientName"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <GiftIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              {errors.recipientName && (
                <span className={"form-errors"}>
                  {t("recipientNameRequired")}
                </span>
              )}
            </div>

            {showEmail ? (
              <div>
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
                  <Controller
                    name="recipientEmail"
                    control={control}
                    rules={{
                      required: true,
                      pattern:
                        /^([a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)$/i,
                    }}
                    render={({ field: { onChange, value } }) => (
                      <MaterialTextField
                        onChange={onChange}
                        value={value}
                        label={t("recipientEmail")}
                        variant="outlined"
                        data-test-id="giftRecipient"
                      />
                    )}
                  />

                  {errors.recipientEmail && (
                    <span className={"form-errors"}>{t("emailRequired")}</span>
                  )}
                </div>
                <div className={"form-field mt-30"}>
                  <Controller
                    name="message"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <MaterialTextField
                        onChange={onChange}
                        value={value}
                        multiline
                        minRows={3}
                        maxRows={4}
                        label={t("giftMessage")}
                        variant="outlined"
                        data-test-id="giftMessage"
                      />
                    )}
                  />
                </div>
              </div>
            ) : (
              <div className={"form-field mt-30"}>
                <button
                  onClick={() => setshowEmail(true)}
                  className={"addEmailButton"}
                  data-test-id="addEmailButton"
                >
                  {t("addEmail")}
                </button>
              </div>
            )}
            <button
              onClick={handleSubmit(onSubmit)}
              className="primary-button w-100 mt-30"
              data-test-id="giftSubmit"
            >
              {t("continue")}
            </button>
          </div>
        </div>
      ) : (
        <div className="donation-supports-info mt-10">
          <p onClick={() => resetGiftForm()}>
            {t("directGiftRecipient", {
              name: giftDetails.recipientName,
            })}
          </p>
          {router && router.query.s ? (
            <></>
          ) : (
            <button
              onClick={() => resetGiftForm()}
              className={"singleGiftRemove"}
            >
              {t("removeRecipient")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
