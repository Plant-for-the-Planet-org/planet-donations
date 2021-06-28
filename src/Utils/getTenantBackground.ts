import defaultForest from '../../public/tenants/default/default-forest.jpg'
import klumforest from '../../public/tenants/leniklum/leniklum.jpg'

export function getTenantBackground(tenant:any){
    switch(tenant){
        case 'ten_I9TW3ncG': return defaultForest;
        case 'ten_KRHYP8TR': return klumforest;
        default : return defaultForest;
    }
}