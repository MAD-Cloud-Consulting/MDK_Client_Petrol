import ConfirmationDateFromOData from '../ConfirmationDateFromOData';
import commonLib from '../../Common/Library/CommonLibrary';

export default function ConfirmationsDateDetails(context) {
    let binding = context.getBindingObject();
    let offsetOdataDate = ConfirmationDateFromOData(context, binding, true);
    const mileageActivityType = commonLib.getMileageActivityType(context);

    if (mileageActivityType && mileageActivityType === binding.ActivityType) {
        return context.formatDate(offsetOdataDate.date(),'','',{format:'short'})+ ' '+context.formatTime(offsetOdataDate.date(),'','',{format:'long'});
    } else {
        return context.formatDate(offsetOdataDate.date());
    }

}
