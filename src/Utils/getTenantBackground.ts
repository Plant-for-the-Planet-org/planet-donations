import defaultForest from '../../public/tenants/default/default-forest.jpg'
import klumforest from '../../public/tenants/leniklum/leniklum.jpg'
import sitex from '../../public/tenants/sitex/sitex.png'

export function getTenantBackground(tenant:any){
    switch(tenant){
        case 'ten_I9TW3ncG': return defaultForest;
        case 'ten_KRHYP8TR': return klumforest;
        case 'ten_cFbEAF7H': return sitex;
        default : return defaultForest;
    }
}