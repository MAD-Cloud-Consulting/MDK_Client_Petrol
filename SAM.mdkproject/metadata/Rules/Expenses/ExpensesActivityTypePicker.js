import libCommon from '../Common/Library/CommonLibrary';

export default function ExpensesActivityTypePicker(context) {
    const activityType = libCommon.getExpenseActivityType(context);

    if (activityType) {
        return [{DisplayValue: activityType, ReturnValue: activityType}];
    } else {
        return [];
    }

}
