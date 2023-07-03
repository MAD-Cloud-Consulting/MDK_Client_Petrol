import filterLib from '../../Filter/FilterLibrary';

export default function InspectionCharacteristicsFDCFilterReset(context) {
    context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().Equipment = '';
    context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().FuncLoc = '';
    context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().Segment = '';
    context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().Operations = '';
    filterLib.setDefaultFilter(context.getPageProxy(), true);
}
