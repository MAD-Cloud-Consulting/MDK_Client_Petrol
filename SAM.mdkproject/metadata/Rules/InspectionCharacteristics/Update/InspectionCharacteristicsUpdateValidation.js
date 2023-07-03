import libCom from '../../Common/Library/CommonLibrary';
import inspCharLib from './InspectionCharacteristics';
import inspectionCharacteristicsCodeValue from './InspectionCharacteristicsCodeValue';
import libVal from '../../Common/Library/ValidationLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';

export default function InspectionCharacteristicsUpdateValidation(context) {
    let qualitativeValueControl = libCom.getControlProxy(context, 'QualitativeValue');
    let qualitativeValueSegmentControl = libCom.getControlProxy(context, 'QualitativeValueSegment');
    if (qualitativeValueControl.visible) {
        libCom.setInlineControlErrorVisibility(qualitativeValueControl, false);
        qualitativeValueControl.clearValidation();
    } else {
        libCom.setInlineControlErrorVisibility(qualitativeValueSegmentControl, false);
        qualitativeValueSegmentControl.clearValidation();
    }
    libCom.setInlineControlErrorVisibility(libCom.getControlProxy(context, 'QuantitativeValue'), false);
    libCom.getControlProxy(context, 'QuantitativeValue').clearValidation();

    if (context.binding.CharCategory === 'X' && inspCharLib.isQualitative(context.binding)) {
        let code = inspectionCharacteristicsCodeValue(context);
        if (libVal.evalIsEmpty(code)) {
            return setInlineError(qualitativeValueControl.visible ? 'QualitativeValue' : 'QualitativeValueSegment', context.localizeText('field_is_required'));
        }
    } else if (inspCharLib.isQuantitative(context.binding) || inspCharLib.isCalculatedAndQuantitative(context.binding)) {
        let value = libCom.getFieldValue(context, 'QuantitativeValue', '', null, true);
        
        if (context.binding.CharCategory === 'X') {
            if (libVal.evalIsEmpty(value)) {
                return setInlineError('QuantitativeValue', context.localizeText('field_is_required'));
            } else if (String(value) === '0') {
                let valueAccepted = false;
                if (context.binding.LowerLimitFlag === 'X' && context.binding.LowerLimit >= value) {
                    valueAccepted = true;
                }
                if (valueAccepted && context.binding.UpperLimitFlag === 'X') {
                    if (context.binding.UpperLimit <= value) {
                        valueAccepted = true;
                    } else {
                        valueAccepted = false;
                    }
                }
                if (!valueAccepted) {
                    return setInlineError('QuantitativeValue', context.localizeText('field_is_required'));
                }
            }
        }

        if (!libLocal.isNumber(context, value)) {
            return setInlineError('QuantitativeValue', context.localizeText('validation_reading_is_numeric'));
        }
    }
    return Promise.resolve(true);

    function setInlineError(controlName, message) {
        libCom.executeInlineControlError(context, libCom.getControlProxy(context, controlName), message);
        return Promise.reject(false);
    }
}
