import inspCharLib from './InspectionCharacteristics';
import MyButtonLib from '../../../Extensions/ButtonStackModule/ButtonStackLibrary';
import deviceType from '../../Common/DeviceType';

export default function InspectionCharacteristicsOnValidateOrCalculate(context) {
    let name = context.getName();
    let suffix = name.substring(name.indexOf('_'), name.length);
    let valuationControl = 'Valuation' + suffix;

    let defectExtensionName;
    let validateButtonName;
    let recordDefectsButtonName;

    if (deviceType(context) === 'Tablet') {
        defectExtensionName = 'MyExtensionControlName';
        validateButtonName = 'ValidateOrCalculateButtonTablet';
        recordDefectsButtonName = 'RecordDefectsButtonTablet';
    } else {
        defectExtensionName = 'MyExtensionControlNameRecordDefect';
        validateButtonName = 'ValidateOrCalculateButton';
        recordDefectsButtonName = 'RecordDefectsButton';
    }

    let defectButtonStack = defectExtensionName + suffix;
    let defectContext = context.getPageProxy().getControl('FormCellContainer')._control.getCellProxyWithName(defectButtonStack)._control._extension.context._clientAPI;

    if (inspCharLib.isCalculatedAndQuantitative(context.binding)) {
        let valueControl = 'QuantitativeValue' + suffix;
        if (inspCharLib.isCalculatedAndQuantitative(context.binding)) {
            return inspCharLib.calulateFormula(context).then((result) => {
                let value = parseFloat(result);
                let valueAccepted = true;
                if (context.binding.LowerLimitFlag === 'X' && value <= context.binding.LowerLimit) {
                    valueAccepted = false;
                }
                if (context.binding.UpperLimitFlag === 'X' && value >= context.binding.UpperLimit) {
                    valueAccepted = false;
                }
                if (valueAccepted) {
                    context.binding.Valuation='A';
                    if (inspCharLib.isManualDefectRecordingEnable(context)) {
                        MyButtonLib.setEditable(defectContext, recordDefectsButtonName, false);
                    }
                } else {
                    context.binding.Valuation='R';
                    if (inspCharLib.isManualDefectRecordingEnable(context)) {
                        MyButtonLib.setEditable(defectContext, recordDefectsButtonName, true);
                    }
                }

                let valCtrl = context.getPageProxy().getControl('FormCellContainer')._control.getCellProxyWithName(valuationControl);
                let valCtrlSpecifier = valCtrl.getTargetSpecifier();
                valCtrlSpecifier.setQueryOptions("$filter=Valuation eq '" + context.binding.Valuation + "'");
                valCtrl.setTargetSpecifier(valCtrlSpecifier);
                valCtrl.setValue("InspectionResultValuations('" + context.binding.Valuation + "')");

                context.getPageProxy().getControl('FormCellContainer')._control.getCellProxyWithName(valueControl).setValue(value);
                MyButtonLib.setTitle(context, validateButtonName, context.localizeText('calculated'));
                MyButtonLib.setEditable(context, validateButtonName, true);
            }).catch(() => {
                return Promise.resolve();
            });
        }
    }
    if (inspCharLib.isQuantitative(context.binding)) {
        let valueControl = 'QuantitativeValue' + suffix;
        let value = parseFloat(context.getPageProxy().getControl('FormCellContainer')._control.getCellProxyWithName(valueControl).getValue());
        let valueAccepted = true;
        if (context.binding.LowerLimitFlag === 'X' && value <= context.binding.LowerLimit) {
            valueAccepted = false;
        }
        if (context.binding.UpperLimitFlag === 'X' && value >= context.binding.UpperLimit) {
            valueAccepted = false;
        }
        if (valueAccepted) {
            context.binding.Valuation='A';
            if (inspCharLib.isManualDefectRecordingEnable(context)) {
                MyButtonLib.setEditable(defectContext, recordDefectsButtonName, false);
            }
        } else {
            context.binding.Valuation='R';
            if (inspCharLib.isManualDefectRecordingEnable(context)) {
                MyButtonLib.setEditable(defectContext, recordDefectsButtonName, true);
            }
        }

        let valCtrl = context.getPageProxy().getControl('FormCellContainer')._control.getCellProxyWithName(valuationControl);
        let valCtrlSpecifier = valCtrl.getTargetSpecifier();
        valCtrlSpecifier.setQueryOptions("$filter=Valuation eq '" + context.binding.Valuation + "'");
        valCtrl.setTargetSpecifier(valCtrlSpecifier);
        valCtrl.setValue("InspectionResultValuations('" + context.binding.Valuation + "')");

        MyButtonLib.setTitle(context, validateButtonName, context.localizeText('validated'));
        MyButtonLib.setEditable(context, validateButtonName, false);
    }
}
