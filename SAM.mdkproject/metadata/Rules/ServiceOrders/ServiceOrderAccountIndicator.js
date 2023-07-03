import libCommon from '../Common/Library/CommonLibrary';

export default function ServiceOrderAccountIndicator(context) {
    let binding = context.binding;
    if (!libCommon.isDefined(binding)) {
        binding = context.getPageProxy().binding;
    }

    //AccountingIndicator is saved in 2 places - MyWorkOrderHeaders('MyWONumber').AccountingIndicator and MyWorkOrderSales('MyWONumber').AccountingIndicator. I'm not sure why.
    let accountingIndicator = binding.AccountingIndicator;
    if (!libCommon.isDefined(accountingIndicator)) {
        accountingIndicator =  binding.WOHeader_Nav.AccountingIndicator;
    }

    if (libCommon.isDefined(accountingIndicator)) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'AcctIndicators(\'' + accountingIndicator + '\')', [], '').then(result => {
            if (result && result.getItem(0)) {
                return `${accountingIndicator} - ${result.getItem(0).AcctIndicatorDesc}`;
            } else {
                return accountingIndicator;
            }
        });
    }
    return '-';
}
