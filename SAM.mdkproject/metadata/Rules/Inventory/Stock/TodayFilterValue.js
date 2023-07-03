
export default function TodayFilterValue(context) {
    let clientData = context.evaluateTargetPath('#Page:StockListViewPage/#ClientData');
    return clientData.isForToday;
}
