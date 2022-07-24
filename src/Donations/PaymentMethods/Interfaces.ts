    import { AuthorizationStripe } from "../../Common/Types/index"
     
     export interface FrequencyDetails {
        minQuantity: number;
        options: {
            id: string;
            quantity: number;
            isDefault: Boolean;
            caption: null;
            description: null;
            icon: null
        }[]
    }

    export interface Frequencies {
        once: FrequencyDetails;
        monthly: FrequencyDetails;
        yearly: FrequencyDetails;
    }

    export interface PaypalAuthorization {
        client_id: string;
    }

    export interface Paypal {
        methods: string[] | null;
        account: string;
        authorization: PaypalAuthorization;
    }

   

    enum StripeMethods {
        CARD = "card",
        SEPA_DEBIT = "sepa_debit",
        GIROPAY = "giropay",
        SOFORT = "sofort",
        APPLE_PAY = "apple_pay",
        BROWSER =  "browser",
        GOOGLEPAY =  "google_pay",
    }

    export interface Stripe {
        methods: StripeMethods[];
        account: string;
        authorization: AuthorizationStripe;
        stripePublishableKey?: string;
    }

    export interface Offline {
        methods: StripeMethods[];
        account: string;
    }

    export interface Gateways {
        paypal: Paypal;
        stripe: Stripe;
        offline: Offline;
    }

    export interface Recurrency {
        supported: boolean;
        methods: StripeMethods[];
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
        frequencies: Frequencies | null;
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

        export interface GiftDetails {
            giftMessage: string | null;
            recipientEmail: string | null;
            recipientName: string | null;
            type:string | null;
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
            giftDetails: GiftDetails;
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
        export interface Transitional {
            silentJSONParsing: boolean
            forcedJSONParsing: boolean
            clarifyTimeoutError: boolean
        }
        export interface Headers2 {
            Accept: string
            "X-SESSION-ID": string
            "X-ACCEPT-VERSION": string
        }

        export interface Params {
            tenant: string
            locale: string
        }

        export interface Config {
            url: string;
            method: string;
            headers: Headers2;
            params: Params;
            baseURL: string;
            transformRequest: any[];
            transformResponse: any[];
            timeout: number;
            xsrfCookieName: string;
            xsrfHeaderName: string;
            maxContentLength: number;
            maxBodyLength: number;
            transitional: Transitional;
        }
      
        export interface Headers {
            "cache-control": string
            "content-type": string
            expires: string
        }

        export interface Request {}
        export interface paymentSetupData {
            config: Config;
            data: {currency: string; effectiveCountry: string};
            headers: Headers;
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
            headers: Headers;
            request: Request;
            status: number;
            statusText: string;
        }
        


        export interface onBehalfDonar {
            firstName: string;
            lastName: string;
            email: string;
        }

        export interface AppVersion {
            android: string;
            ios: string;
        }

        export interface CdnMedia {
            cache: string;
            images: string;
            pdfs: string
        }
       
        export interface Loc {
            city: string;
            countryCode: string;
            latitude: string;
            longitude: string;
            postalCode: string;
            regionCode: string;
            timezone: string;
        }

        export interface LoadConfig {
            config: Config;
            data: {
                appVersions: AppVersion;
                cdnMedia:  CdnMedia;
                clientIp: string;
                country: string;
                currency: string;

            };
            loc: Loc;
            headers: {
                "cache-control": string
                "content-type": string
            }
            request: Request;
            status: number;
            statusText: string;
        }


        export interface TransferDetails {
            bankName: string;
            beneficiary: string;
            bic: string;
            iban: string;
        }