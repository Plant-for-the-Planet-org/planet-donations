     export interface Date {
        minQuantity: number;
        options: {
            id: string;
            quantity: number;
            isDefault: number;
        }[]
    }

    export interface Frequencies {
        once: Date;
        monthly: Date;
        yearly: Date;
    }

    export interface PaypalAuthorization {
        client_id: string;
    }

    export interface Paypal {
        methods: string[] | null;
        account: string;
        authorization: PaypalAuthorization;
    }

    export interface StripeAuthorization {
        stripePublishableKey: string;
        accountId: string;
    }

    export interface Stripe {
        methods: string[];
        account: string;
        authorization: StripeAuthorization;
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

    export interface PaymentSetup {
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
        tin?: string | undefined;
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
        gift?: {
            code: string;
            recipientName: string;
            type: string
        } | null;
        donor: ContactDetails;
        destination: Destination;
        paymentDate?: any;
        signupPending: boolean;
        hasPublicProfile: boolean;
        uid: string;
        donorAlias?: any;
        amount: number;
        currency: string;
        frequency?: Frequencies | null;
        gateway: string;
        paymentStatus: string;
        taxDeductionCountry: string;
        quantity: number;
       }

    

    //3

        export interface giftDetails {
            giftMessage: string;
            recipientEmail: string;
            recipientName: string;
            type:string;
        }
        
        export interface ProjectDetails {
                description: string;
                id: string;
                name: string;
                ownerAvatar: string;
                ownerName: string;
                projectImage: string;
                purpose: string;
                taxDeductionCountries: string[] | string;
            }
        export interface  ServerProps {
            donationStep: number;
            showErrorCard: boolean;
            projectDetails: ProjectDetails | null;
            isGift: boolean;
            giftDetails: giftDetails;
            frequency: string;
            hideTaxDeduction: boolean;
            isTaxDeductible: boolean;
            donationID: string | null;
            shouldCreateDonation: boolean;
            country: string;
            isDirectDonation: boolean;
            contactDetails: ContactDetails;
            treecount: number;
            allowTaxDeductionChange: boolean;
            currency: string;
            paymentSetup: PaymentSetup;
            amount: number;
            tenant: string;
            locale: string;
        }
    
    //

       
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
            degradationCause?: string;
            longTermPlan?: string;
            mainChallenge?: string;
            motivation?: string;
        }
    
        export interface ProjectProperties {
            id: string;
            _scope: string;
            allowDonations: boolean;
            classification: string;
            countPlanted: number;
            countTarget: number;
            country: string;
            currency: string;
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
            description?: string;
            metadata: Metadata;
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


        export interface Request {
            
        }
        export interface Config {

        }

        export interface Header {

        }
        export interface paymentSetupData {
            config: Config;
            data: {currency: string; effectiveCountry: string} ;
            headers: Header;
            request: Request;
            status: number;
            statusText: string;
        }

       
        export interface Score {
                personal: number;
                received: number;
                target: number;
            }
        export interface Profile {
                id: string;
                slug: string;
                type: string;
                currency: string;
                name: string;
                firstname: string;
                lastname: string;
                country: string;
                email: string;
                image?: string | null;
                url?: string | null;
                urlText?: string | null;
                planetCash?: boolean | null;
                displayName: string;
                score: Score;
                supportedProfile?: any;
                isReviewer: boolean;
                isPrivate: boolean;
                getNews: boolean;
                bio?: any;
                address: Address;
                locale: string;
                hasLogoLicense?: any;
                tin?: string | undefined;
            }

        
        export interface Datum {
            type: string;
            geometry: Geometry;
            properties: ProjectProperties;
        }
        export interface projects {
            config: Config;
            data: Datum[];
            headers: Header;
            request: Request;
            status: number;
            statusText: string;
        }
        


        export interface onBehalfDonar {
            firstName: string;
            lastName: string;
            email: string;
        }
       