import libEval from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import style from '../../Common/Style/StyleFormCellButton';
import hideCancel from '../../ErrorArchive/HideCancelForErrorArchiveFix';

export default function BOMCreateUpdateOnPageLoad(context) {
    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }
    hideCancel(context);
    style(context, 'DiscardButton');
    libCom.saveInitialValues(context);
    let plant = '';
    let slocValue = '';
    let materialNumber = '';
    if (!libEval.evalIsEmpty(context.evaluateTargetPath('#Control:PlantLstPkr').getValue()) && context.evaluateTargetPath('#Control:PlantLstPkr').getValue().length > 0) {
        plant = context.evaluateTargetPath('#Control:PlantLstPkr').getValue()[0].ReturnValue;
    }
    if (!libEval.evalIsEmpty(context.evaluateTargetPath('#Control:StorageLocationLstPkr').getValue()) && context.evaluateTargetPath('#Control:StorageLocationLstPkr').getValue().length > 0) {
        slocValue = context.evaluateTargetPath('#Control:StorageLocationLstPkr').getValue()[0].ReturnValue;
    }
    if (!libEval.evalIsEmpty(context.evaluateTargetPath('#Control:MaterialLstPkr').getValue()) && context.evaluateTargetPath('#Control:MaterialLstPkr').getValue().length > 0) {
        materialNumber = context.evaluateTargetPath('#Control:MaterialLstPkr').getValue()[0].ReturnValue;
    }
    let availableQuantity = context.evaluateTargetPath('#Control:AvailableQuantity');
    availableQuantity.setValue(0);

    if (libEval.evalIsEmpty(plant)) {
        plant = context.binding.Plant;
    }
    if (libEval.evalIsEmpty(slocValue)) {
        slocValue = [context.binding.StorageLocation];
    }
    if (libEval.evalIsEmpty(materialNumber)) {
        materialNumber = context.binding.MaterialNum;
    }
    
    if (!libEval.evalIsEmpty(materialNumber) && !libEval.evalIsEmpty(slocValue) && !libEval.evalIsEmpty(plant)) {
        context.evaluateTargetPath('#Control:OnlineSwitch').setEditable(true);
    }
}
