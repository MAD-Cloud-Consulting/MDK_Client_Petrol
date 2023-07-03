import CommonLibrary from '../Common/Library/CommonLibrary';
import ServiceOrderMileageOrExpenseWorkCenter from '../ServiceOrders/ServiceOrderMileageOrExpenseWorkCenter';

export default function ExpenseCreateUpdateInitialWorkCenter(context) {
    
    let defaultExpenseWorkCenter = CommonLibrary.getExpenseWorkCenter(context);
    return ServiceOrderMileageOrExpenseWorkCenter(context, defaultExpenseWorkCenter);
}
