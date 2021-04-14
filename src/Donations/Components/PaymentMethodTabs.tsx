import React from 'react';
import CreditCard from '../../../public/assets/icons/donation/CreditCard';
import GiroPayIcon from '../../../public/assets/icons/donation/GiroPay';
import PaypalIcon from '../../../public/assets/icons/donation/PaypalIcon';
import SepaIcon from '../../../public/assets/icons/donation/SepaIcon';
import SofortIcon from '../../../public/assets/icons/donation/SofortIcon';

function a11yProps(index: any) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `payment-methods-tabpanel-${index}`,
  };
}

export default function PaymentMethodTabs({
  paymentType,
  setPaymentType,
  showPaypal,
  showGiroPay,
  showSepa,
  showSofort,
  showCC,
}: any) {
  const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setPaymentType(newValue);
  };

  function CheckMark() {
    return (
      <div className={'check-mark'}>
        <svg
          height="20px"
          width="20px"
          viewBox="0 0 30 30"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g transform="translate(-39 -408)" data-name="Group 3308">
            <path
              transform="translate(39 408)"
              d="M15,0A15,15,0,1,1,0,15,15,15,0,0,1,15,0Z"
              fill="#48aadd"
              data-name="Path 2171"
            />
            <path
              transform="translate(44.957 351.72)"
              d="M6.143,77.228.265,71.836a.782.782,0,0,1,0-1.173l1.279-1.173a.963.963,0,0,1,1.279,0l3.96,3.633,8.481-7.781a.963.963,0,0,1,1.279,0l1.279,1.173a.782.782,0,0,1,0,1.173l-10.4,9.541a.963.963,0,0,1-1.279,0Z"
              fill="#fff"
            />
          </g>
        </svg>
      </div>
    );
  }
  
  return (
    <div className={'payment-methods-tabs-container'}>
      {showCC && (
        <button
          className={`${'payment-method'} ${
            paymentType === 'CARD' ? 'payment-method-selected' : ''
          }`}
          onClick={(e) => handleChange(e, 'CARD')}
          {...a11yProps('CARD')}
        >
          <CreditCard />
          <CheckMark />
        </button>
      )}

      {showSofort && (
        <button
          className={`${'paymentMethod'} ${
            paymentType === 'Sofort' ? 'payment-method-selected' : ''
          }`}
          onClick={(e) => handleChange(e, 'Sofort')}
          {...a11yProps('Sofort')}
        >
          <SofortIcon />
          <CheckMark />
        </button>
      )}

      {showPaypal ? (
        <button
          className={`${'paymentMethod'} ${
            paymentType === 'Paypal' ? 'payment-method-selected' : ''
          }`}
          onClick={(e) => handleChange(e, 'Paypal')}
          {...a11yProps('Paypal')}
        >
          <PaypalIcon />
          <CheckMark />
        </button>
      ) : null}

      {showGiroPay && (
        <button
          className={`${'paymentMethod'} ${
            paymentType === 'GiroPay' ? 'payment-method-selected' : ''
          }`}
          onClick={(e) => handleChange(e, 'GiroPay')}
          {...a11yProps('GiroPay')}
        >
          <GiroPayIcon />
          <CheckMark />
        </button>
      )}

      {showSepa && (
        <button
          className={`${'paymentMethod'} ${
            paymentType === 'SEPA' ? 'payment-method-selected' : ''
          }`}
          onClick={(e) => handleChange(e, 'SEPA')}
          {...a11yProps('SEPA')}
        >
          <SepaIcon />
          <CheckMark />
        </button>
      )}
    </div>
  );
}
