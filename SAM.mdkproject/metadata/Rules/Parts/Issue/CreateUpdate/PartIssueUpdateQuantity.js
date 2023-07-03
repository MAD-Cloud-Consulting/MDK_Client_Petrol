import libCom from '../../../Common/Library/CommonLibrary';
import libLocal from '../../../Common/Library/LocalizationLibrary';

export default function PartIssueUpdateQuantity(context) {
    let value = libCom.getTargetPathValue(context, '#Control:QuantitySim/#Value');
    return libLocal.toNumber(context, value);
}
