import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ExpenseCreateUpdateInitialWorkCenter from '../../ExpenseCreateUpdateInitialWorkCenter';

export default function ExpenseActivityPickerQueryOptions(context) {

    return ExpenseCreateUpdateInitialWorkCenter(context).then(workCenter => {
        return CommonLibrary.buildActivityTypeQueryOptions(context, workCenter);
    });
   
}
