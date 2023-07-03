import { PartnerFunction } from '../../Common/Library/PartnerFunction';

export default function ServiceOrderCreateUpdateSoldToParty(context) {
    //get sold to party partner function
    let partnerFunc = PartnerFunction.getSoldToPartyPartnerFunction();
    let binding = context.getPageProxy().binding;

    if (binding.SoldToParty) {
        return binding.SoldToParty;
    }
    
    if (binding.WOPartners) {
        let woPartner = binding.WOPartners.find((partner) => {
            return partner.PartnerFunction === partnerFunc;
        });
        if (woPartner.Partner) {
            return woPartner.Partner;
        } else if (woPartner.NewPartner) {
            return woPartner.NewPartner;
        }
    }
    return '';
}
