

    export interface Once {
        minQuantity: number;
        options: any[];
    }

    export interface Monthly {
        minQuantity: number;
        options: any[];
    }

    export interface Yearly {
        minQuantity: number;
        options: any[];
    }

    export interface Frequencies {
        once: Once;
        monthly: Monthly;
        yearly: Yearly;
    }

    export interface Authorization {
        client_id: string;
    }

    export interface Paypal {
        methods: string[];
        account: string;
        authorization: Authorization;
    }

    export interface Authorization2 {
        stripePublishableKey: string;
        accountId: string;
    }

    export interface Stripe {
        methods: string[];
        account: string;
        authorization: Authorization2;
    }

    export interface Offline {
        methods: string[];
        account: string;
    }

    export interface Gateways {
        paypal: Paypal;
        stripe: Stripe;
        offline: Offline;
    }

    export interface Recurrency {
        supported: boolean;
        methods: string[];
    }

    export interface RootObject {
        id: string;
        name: string;
        ownerName: string;
        ownerAvatar: string;
        description: string;
        image: string;
        requestedCountry: string;
        effectiveCountry: string;
        frequencies: Frequencies;
        taxDeductionCountries: string[];
        gateways: Gateways;
        purpose: string;
        recurrency: Recurrency;
        unit: string;
        unitCost: number;
        currency: string;
    }

    export interface  contactDetails {
        firstname: string;
        lastname: string;
        email: string;
        address: string;
        city: string;
        zipCode: string;
        country: string;
        companyname: string;
    }

    //


    export interface Once {
        minQuantity: number;
        options: any[];
    }

    export interface Monthly {
        minQuantity: number;
        options: any[];
    }

    export interface Yearly {
        minQuantity: number;
        options: any[];
    }

    export interface Frequencies {
        once: Once;
        monthly: Monthly;
        yearly: Yearly;
    }

    export interface Authorization {
        client_id: string;
    }

    export interface Paypal {
        methods: string[];
        account: string;
        authorization: Authorization;
    }

    export interface Authorization2 {
        stripePublishableKey: string;
        accountId: string;
    }

    export interface Stripe {
        methods: string[];
        account: string;
        authorization: Authorization2;
    }

    export interface Offline {
        methods: string[];
        account: string;
    }

    export interface Gateways {
        paypal: Paypal;
        stripe: Stripe;
        offline: Offline;
    }

    export interface Recurrency {
        supported: boolean;
        methods: string[];
    }

    export interface RootObject {
        id: string;
        name: string;
        ownerName: string;
        ownerAvatar: string;
        description: string;
        image: string;
        requestedCountry: string;
        effectiveCountry: string;
        frequencies: Frequencies;
        taxDeductionCountries: string[];
        gateways: Gateways;
        purpose: string;
        recurrency: Recurrency;
        unit: string;
        unitCost: number;
        currency: string;
    }

    //

    export interface  serverProps {
        donationStep: number;
        showErrorCard: boolean;
        projectDetails: object | null;
        isGift: boolean;
        giftDetails: object;
        frequency: string;
        hideTaxDeduction: boolean;
        isTaxDeductible: boolean;
        donationID: any;
        shouldCreateDonation: boolean;
        country: string;
        isDirectDonation: boolean;
        contactDetails: object;
        treecount: number;
        allowTaxDeductionChange: boolean;
        currency: string;
        paymentSetup: object;
        amount: number;
        tenant: string;
        locale: string;
       }
