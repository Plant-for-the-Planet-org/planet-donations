import React, { ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import MaterialTextField from "../../Common/InputTypes/MaterialTextField";
import InputAdornment from "@mui/material/InputAdornment";
import { useTranslation } from "next-i18next";
import { QueryParamContext } from "../../Layout/QueryParamContext";
import ToggleSwitch from "../../Common/InputTypes/ToggleSwitch";
import { useRouter } from "next/router";
import GiftIcon from "public/assets/icons/GiftIcon";
import { NoGift } from "@planet-sdk/common/build/types/donation";
import { isEmailValid } from "src/Utils/isEmailValid";

type GiftFormData = {
  recipientName: string;
  recipientEmail: string;
  message: string;
};

const EMPTY_GIFT_DETAILS: Readonly<NoGift> = {
  recipientName: "",
  recipientEmail: "",
  message: "",
  type: null,
};

export default function GiftForm(): ReactElement {
  const { t } = useTranslation("common");
  const [showEmail, setShowEmail] = React.useState(false);
  const { giftDetails, setGiftDetails, isGift, setIsGift, projectDetails } =
    React.useContext(QueryParamContext);

  const defaultDetails: GiftFormData = {
    recipientName: giftDetails.recipientName || "",
    recipientEmail:
      (giftDetails.type === "invitation" && giftDetails.recipientEmail) || "",
    message: (giftDetails.type === "invitation" && giftDetails.message) || "",
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
        setGiftDetails({ ...giftDetails, type: "invitation" });
      }
    } else {
      setGiftDetails(EMPTY_GIFT_DETAILS);
    }
  }, [isGift]);

  const onSubmit = (data: GiftFormData) => {
    setGiftDetails((giftDetails) => {
      return { ...giftDetails, ...data, type: "invitation" };
    });
  };

  const resetGiftForm = () => {
    setGiftDetails(EMPTY_GIFT_DETAILS);
    reset(EMPTY_GIFT_DETAILS);
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
                setIsGift((isGift) => !isGift);
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
                rules={{
                  required: {
                    value: true,
                    message: t("recipientNameRequired"),
                  },
                  maxLength: {
                    value: 35,
                    message: t("recipientNameTooLong"),
                  },
                }}
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
              {errors.recipientName !== undefined && (
                <div className={"form-errors"}>
                  {errors.recipientName.message}
                </div>
              )}
            </div>

            {projectDetails?.classification !== "membership" && (
              <>
                {showEmail ? (
                  <div>
                    <div className={"form-field mt-30"}>
                      <div className="d-flex row justify-content-between mb-10">
                        <p>{t("giftNotification")}</p>
                        <button
                          onClick={() => setShowEmail(false)}
                          className={"singleGiftRemove"}
                        >
                          {t("removeRecipient")}
                        </button>
                      </div>
                      <Controller
                        name="recipientEmail"
                        control={control}
                        rules={{
                          required: {
                            value: true,
                            message: t("emailRequired"),
                          },
                          validate: {
                            emailInvalid: (value) =>
                              value.length === 0 || isEmailValid(value),
                          },
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
                        <div className={"form-errors"}>
                          {errors.recipientEmail.type === "required"
                            ? t("emailRequired")
                            : t("enterValidEmail")}
                        </div>
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
                      onClick={() => setShowEmail(true)}
                      className={"addEmailButton"}
                      data-test-id="addEmailButton"
                    >
                      {t("addEmail")}
                    </button>
                  </div>
                )}
              </>
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
            {t("giftDedicatedTo", {
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
