import React, { ReactElement } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next';
import { QueryParamContext } from 'src/Layout/QueryParamContext';

interface Props {
    donationContext: string;
    donationStatus: string;
}

export default function ReturnToButton({ donationContext, donationStatus }: Props): ReactElement {
    const { returnTo, callbackMethod } = React.useContext(QueryParamContext);
    const router = useRouter();
    const { t } = useTranslation('common');

    React.useEffect(() => {
        if (callbackMethod === 'api') {
            router.push(`${returnTo}?context=${donationContext}&don_status=${donationStatus}`)
        }
    }, [callbackMethod]);

    const x = returnTo.slice(8);
    const returnDisplay = x.split("/", 2);

    const sendToReturn = () => {
        if (callbackMethod === 'api') {
            router.push(`${returnTo}?context=${donationContext}&don_status=${donationStatus}`)
        } else {
            router.push(`${returnTo}`);
        }
    }

    return (
        <>
            <button
                onClick={() => sendToReturn()}
                className="primary-button"
                style={{ marginBottom: 20 }}
            >
                {t('common:returnTo')} {returnDisplay[0]}
            </button>
        </>
    )
}
