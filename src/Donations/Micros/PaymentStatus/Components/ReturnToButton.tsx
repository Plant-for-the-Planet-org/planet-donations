import React, { ReactElement } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next';

interface Props {
    returnTo: string;
    donationContext: string;
    donationStatus: string;
}

export default function ReturnToButton({ returnTo, donationContext, donationStatus }: Props): ReactElement {

    const router = useRouter();
    const { t } = useTranslation('common');

    let returnDisplay;
    const x = returnTo.slice(8);
    returnDisplay = x.split("/", 2);

    const sendToReturn = () => {
        router.push(`${returnTo}?context=${donationContext}&don_status=${donationStatus}`);
    }
    return (
        <button
            onClick={() => sendToReturn()}
            className="primary-button"
            style={{ marginBottom: 20 }}
        >
            {t('common:returnTo')} {returnDisplay[0]}
        </button>
    )
}
