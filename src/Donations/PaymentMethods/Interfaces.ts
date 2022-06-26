

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
        stripePublishableKey?: string;
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

    export interface  ContactDetails {
        firstname: string;
        lastname: string;
        email: string;
        address: string;
        city: string;
        zipCode: string;
        country: string;
        companyname?: string;
        tin?: any;
    }

    //2

    export interface Metadata {
        callback_url: string;
        callback_method: string;
    }

    export interface Project {
        id: string;
        name: string;
        country: string;
        purpose: string;
    }

   

    export interface Destination {
        id: string;
        type: string;
        country: string;
        currency: string;
        purpose: string;
        name: string;
    }

    export interface Donation {
        id: string;
        treeCount: number;
        token: string;
        metadata: Metadata;
        isRecurrent: boolean;
        tenant: string;
        project: Project;
        gift?: any;
        donor: ContactDetails;
        destination: Destination;
        paymentDate?: any;
        signupPending: boolean;
        hasPublicProfile: boolean;
        uid: string;
        donorAlias?: any;
        amount: number;
        currency: string;
        frequency?: any;
        gateway: string;
        paymentStatus: string;
        taxDeductionCountry: string;
        quantity: number;
       }

    

    //3

    export interface  serverProps {
        donationStep: number;
        showErrorCard: boolean;
        projectDetails:{} | null;
        isGift: boolean;
        giftDetails:{};
        frequency: string;
        hideTaxDeduction: boolean;
        isTaxDeductible: boolean;
        donationID: any;
        shouldCreateDonation: boolean;
        country: string;
        isDirectDonation: boolean;
        contactDetails:{};
        treecount: number;
        allowTaxDeductionChange: boolean;
        currency: string;
        paymentSetup:{};
        amount: number;
        tenant: string;
        locale: string;
       }

       //

       export interface projectDetails {
        description: string;
        id: string;
        name: string;
        ownerAvatar: string;
        ownerName: string;
        projectImage: string;
        purpose: string;
        taxDeductionCountries: string[] | string;
       }

       
        export interface Geometry {
            type: string;
            coordinates: number[];
        }
    
        export interface PaymentDefaults {
            fixedTreeCountOptions: number[];
            fixedDefaultTreeCount: number;
        }
    
        export interface Address {
            zipCode: string;
            country: string;
            address: string;
            city: string;
        }
    
        export interface Tpo {
            image: string;
            address: Address;
            name: string;
            id: string;
            email: string;
            slug: string;
        }
    
        export interface Metadata {
            degradationCause?: any;
            longTermPlan?: any;
            mainChallenge?: any;
            motivation?: any;
        }
    
        export interface Properties {
            id: string;
            _scope: string;
            allowDonations: boolean;
            classification: string;
            countPlanted: number;
            countTarget: number;
            country: string;
            currency: string;
            fixedRates: any[];
            image: string;
            isFeatured: boolean;
            isPublished: boolean;
            location: string;
            minTreeCount: number;
            name: string;
            paymentDefaults: PaymentDefaults;
            purpose: string;
            reviewScore: number;
            slug: string;
            taxDeductionCountries: string[];
            tpo: Tpo;
            treeCost: number;
            unitCost: number;
            description?: any;
            metadata: Metadata;
            options: any[];
        }
    
        export interface project {
            type: string;
            geometry: Geometry;
            properties: Properties;
        }
     //

        export interface Country {
            countryCode: string;
            countryName: string;
            currencyCode:string;
            currencyCountryFlag: string;
            currencyName: string;
            languageCode: string
        } 