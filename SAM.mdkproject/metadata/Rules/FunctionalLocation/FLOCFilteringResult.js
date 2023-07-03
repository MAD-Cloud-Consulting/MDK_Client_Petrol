
export default function FLOCFilteringResult(context) {
    let result1 = context.evaluateTargetPath('#Page:FunctionalLocationFilterPage/#Control:WorkCenterFilter/#FilterValue');
    let result2 = context.evaluateTargetPath('#Page:FunctionalLocationFilterPage/#Control:SortFilter/#Value');
    let result3 = context.evaluateTargetPath('#Page:FunctionalLocationFilterPage/#Control:LocalFilter/#Value');
    let filterResults = [result1, result2];

    if (result3 && result3.filterItems.length && result3.filterItems[0]) {
        let filter = context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, undefined, ['sap.islocal()'], true);
        filterResults.push(filter);
    }

    return filterResults;
}
