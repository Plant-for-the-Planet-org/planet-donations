export function getTenantBackground(tenant:any){
    switch(tenant){
        case 'ten_I9TW3ncG': return '/tenants/default/default-forest.jpg';
        case 'ten_KRHYP8TR': return '/tenants/leniklum/leniklum.jpg';
        default : return '/tenants/default/default-forest.jpg';
    }
}