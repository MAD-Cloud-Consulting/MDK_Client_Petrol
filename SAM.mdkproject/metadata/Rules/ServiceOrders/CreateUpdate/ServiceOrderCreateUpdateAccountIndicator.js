import libCommon from '../../Common/Library/CommonLibrary';

export default function ServiceOrderCreateUpdateAccountIndicator(context) {
    let accountingIndicator = -1;
    if (libCommon.isDefined(context.binding.AccountingIndicator)) {
        accountingIndicator = context.binding.AccountingIndicator;
    } else if (libCommon.isDefined(context.binding.WOSales_Nav) && libCommon.isDefined(context.binding.WOSales_Nav.AccountingIndicator)) {
        accountingIndicator = context.binding.WOSales_Nav.AccountingIndicator;
    }
    return accountingIndicator;
}
