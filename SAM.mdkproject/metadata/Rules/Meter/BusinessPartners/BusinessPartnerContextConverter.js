/** a unification for the various business partner formats */

export default function BusinessPartnerContextConverter(context) {
    if (!context.binding.Address_Nav && context.binding.Address) {
        context.binding.Address_Nav = context.binding.Address;
    }
    if (!context.binding.AddressAtWork_Nav && context.binding.AddressAtWork) {
        context.binding.AddressAtWork_Nav = context.binding.AddressAtWork;
    }
    if (!context.binding.PartnerNum && context.binding.Partner) {
        context.binding.PartnerNum = context.binding.Partner;
    } else if (!context.binding.PartnerNum && context.binding.NewPartner) {
        context.binding.PartnerNum = context.binding.NewPartner;
    }
}
