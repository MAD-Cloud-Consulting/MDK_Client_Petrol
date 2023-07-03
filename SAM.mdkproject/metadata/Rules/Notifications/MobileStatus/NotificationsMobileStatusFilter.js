export default function MobileStatusFilter(context) {
    return { name: 'NotifMobileStatus_Nav/MobileStatus', values: [{ReturnValue: 'RECEIVED', DisplayValue: context.localizeText('RECEIVED')}, {ReturnValue: 'STARTED', DisplayValue: context.localizeText('STARTED')}, {ReturnValue: 'COMPLETED', DisplayValue: context.localizeText('COMPLETED')}]};
}
