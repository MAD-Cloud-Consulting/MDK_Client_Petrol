import CommonLibrary from '../../Common/Library/CommonLibrary';
import ServiceOrderMileageOrExpenseWorkCenter from '../ServiceOrderMileageOrExpenseWorkCenter';

export default function MileageAddEditInitialWorkCenter(context) {
    
    let defaultMileageWorkCenter = CommonLibrary.getMileageWorkCenter(context);
    return ServiceOrderMileageOrExpenseWorkCenter(context, defaultMileageWorkCenter);
}
