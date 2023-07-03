import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import inspCharLib from './InspectionCharacteristics';

export default function InspectionCharacteristicsCreateActionsArray(context) {
    let actionArray = [];
    if ((inspCharLib.isQuantitative(context.binding) || inspCharLib.isCalculatedAndQuantitative(context.binding)) && (!libVal.evalIsEmpty(libCom.getControlProxy(context, 'QuantitativeValue').getValue()) && (checkNumber(libCom.getControlProxy(context, 'QuantitativeValue').getValue())) || (context.binding.CharCategory === 'X'))) {
        actionArray.push('/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsQuantitativeUpdate.action');
    } else if (inspCharLib.isQualitative(context.binding) && (!libVal.evalIsEmpty(libCom.getControlProxy(context, 'QualitativeValueSegment').getValue()) || !libVal.evalIsEmpty(libCom.getControlProxy(context, 'QualitativeValue').getValue()) || (context.binding.CharCategory === 'X'))) {
        actionArray.push('/SAPAssetManager/Actions/InspectionCharacteristics/Update/InspectionCharacteristicsQualitativeUpdate.action');
    }
    return actionArray;
}

function checkNumber(number) {
    number = String(number).replace(/[.,]+/g, '');
    if (!isNaN(number) && Number(number) > 0) {
        return true;
    }
    return false;
}
