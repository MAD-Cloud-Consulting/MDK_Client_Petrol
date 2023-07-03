import FilterReset from '../../Filter/FilterReset';

export default function ResetFilters(context) {
    let todaySwitchControl = context.evaluateTargetPath('#Page:StockSearchFilter/#Control:IsTodaySwitch');
    todaySwitchControl.setValue(false);
    return FilterReset(context);
}
