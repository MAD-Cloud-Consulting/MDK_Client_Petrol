import PhysicalInventoryDocCountTotals from './PhysicalInventoryDocCountTotals';
import libCom from '../../Common/Library/CommonLibrary';

export default function PhysicalInventoryDocTags(context) {

    let binding = context.binding;
    let tags = [];

    let targetDate = binding.CountDate || binding.PlanCountdate;
    if (targetDate) {
        let date = libCom.dateStringToUTCDatetime(targetDate);
        let dateText = context.formatDate(date);
        
        tags.push(dateText);
    }

    return PhysicalInventoryDocCountTotals(context, true).then(result => { //Get counted status
        tags.push(result);
        return tags;
    });
}
