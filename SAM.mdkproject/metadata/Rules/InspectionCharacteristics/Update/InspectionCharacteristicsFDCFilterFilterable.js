
export default function InspectionCharacteristicsFDCFilterFilterable(context) {
    return context.evaluateTargetPathForAPI('#Page:OverviewPage').getControl('OverviewPageSectionedTable')._control;
}
