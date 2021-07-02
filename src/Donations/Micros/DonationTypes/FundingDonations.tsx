import React, { ReactElement } from 'react'
import { useTranslation } from "next-i18next";
import { QueryParamContext } from '../../../Layout/QueryParamContext';
import themeProperties from "../../../../styles/themeProperties";
import CollectIcon from '../../../../public/assets/images/funding/collect.png';
import ShovelIcon from '../../../../public/assets/images/funding/shovel.png';
import SproutIcon from '../../../../public/assets/images/funding/sprout.png';
import SunshineIcon from '../../../../public/assets/images/funding/sunshine.png';

import Image from 'next/image'
interface Props {
    setopenCurrencyModal:any;
}

function FundingDonations({setopenCurrencyModal}: Props): ReactElement {
    const { t, i18n } = useTranslation(["common", "country"]);

    const [customInputValue, setCustomInputValue] = React.useState("");

    const [isCustomDonation, setisCustomDonation] = React.useState(false);

    const AllIcons = [ShovelIcon,CollectIcon,SunshineIcon,SproutIcon];
  
    const setCustomValue = (e: any) => {
      if (e.target) {
        // if (e.target.value === "" || e.target.value < 1) {
        //   // if input is '', default 1
        //   settreeCount(1);
        // } else if (e.target.value.toString().length <= 12) {
        //   settreeCount(e.target.value);
        // }
      }
    };
    // React.useEffect(() => {
    //     if (![10, 20, 50, 150].includes(treeCount)) {
    //       setisCustomDonation(true);
    //       setCustomValue(treeCount);
    //       setCustomInputValue(treeCount);
    //     }
    //   }, [treeCount]);

    return (
        <div>
            Funds
            <Image src={CollectIcon} />
            <Image src={ShovelIcon} />
            <Image src={SunshineIcon} />
            <Image src={SproutIcon} />
        </div>
    )
}

export default FundingDonations
