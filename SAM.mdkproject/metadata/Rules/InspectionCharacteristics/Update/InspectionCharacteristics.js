import libCom from '../../Common/Library/CommonLibrary';
import Logger from '../../Log/Logger';
import libThis from './InspectionCharacteristics';
import libVal from '../../Common/Library/ValidationLibrary';
import MyButtonLib from '../../../../SAPAssetManager/Extensions/ButtonStackModule/ButtonStackLibrary';
import deviceType from '../../Common/DeviceType';
import enableMaintenanceTechnician from '../../SideDrawer/EnableMaintenanceTechnician';

export default class {
    /*
    * determines if characteristic is of type quantitative
    */
    static isQuantitative(binding) {
        return (binding.QuantitativeFlag === 'X' && binding.CalculatedCharFlag === '');
    }

    /**
    * determines if characteristic is of type qualitative
    */
    static isQualitative(binding) {
        return (binding.QuantitativeFlag === '' && binding.CalculatedCharFlag === '');
    }

    /**
    * determines if characteristic is of type calculated
    */
    static isCalculatedAndQuantitative(binding) {
        return (binding.QuantitativeFlag === 'X' && binding.CalculatedCharFlag === 'X');
    }

    /**
    * determines if the formula is a target value
    */
    static isCalculatedTargetValue(formula) {
        return (formula.startsWith('C7') || formula.startsWith('c7'));
    }

    /**
    * determines if the formula is a input value
    */
    static isCalculatedInputValue(formula) {
        return (formula.startsWith('C0') || formula.startsWith('c0'));
    }

    /**
    * determines if flag ManualDefectRecording is enable or not
    */
     static isManualDefectRecordingEnable(context) {
        if (enableMaintenanceTechnician(context)) {
            return (libCom.getAppParam(context, 'EAM_CHECKLIST', 'ManualDefectRecording') === 'Y');
        }
        return false;
    }

    /**
    * calculate the formula ((CD0004+CE0050)*2)+DE0050)  = ((30+20)*2)+50)
    * CD0004
    * CD
    * 0004
    */
    static calulateFormula(context) {
        try {
            if (context.binding.Formula1) {
                let formula = context.binding.Formula1;
                let split = formula.match(/([A-Z0-9]{2})([0-9]{4})/g);
                let codes = [];
                let reads = [];
                for (let i=0; i<split.length; i++) {
                    let values = split[i].match(/([A-Z0-9]{2})([0-9]{4})/);
                    let property = libCom.getAppParam(context, 'QMFORMULA',values[1]);
                    codes.push({
                        'Code': values[0],
                        'Item': values[2],
                        'Property': property,
                    });
                }
                let charFound = false;
                let foundError = false;
                let calculateFormula = formula;
                for (let j=0; j< codes.length; j++) {
                    //find the characteristic on the FDC screen
                    let fdcControl = context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getControl('FormCellContainer')._control;
                    let sections = fdcControl.sectionsContexts;
                    if (sections && sections.length > 0) {
                        for (let i=0; i < sections.length; i++) {
                            let section = sections[i];
                            let odataType = section.binding['@odata.type'];
                            if (odataType === '#sap_mobile.InspectionCharacteristic') {
                                let entity = `InspectionCharacteristics(InspectionLot='${context.binding.InspectionLot}',InspectionNode='${context.binding.InspectionNode}',InspectionChar='${codes[j].Item}',SampleNum='${context.binding.SampleNum}')`;
                                let sectionReadLink = section.binding['@odata.readLink'];
                                if (entity === sectionReadLink) {
                                    charFound = true;
                                    let suffix = `_0_${i}`;
                                    let valueControl = 'QuantitativeValue' + suffix;
                                    let extensionName;
                                    let validateButtonName;
    
                                    if (deviceType(context) === 'Tablet') {
                                        extensionName = 'MyExtensionControlName';
                                        validateButtonName = 'ValidateOrCalculateButtonTablet';
                                    } else {
                                        extensionName = 'MyExtensionControlNameValidate';
                                        validateButtonName = 'ValidateOrCalculateButton';
                                    }
    
                                    let buttonStack = extensionName + suffix;
                                    let contextProxy = fdcControl.getCellProxyWithName(buttonStack)._control._extension.context._clientAPI;
                                    let value = parseFloat(fdcControl.getCellProxyWithName(valueControl).getValue());
                                    if (String(value) === '0' || libVal.evalIsEmpty(value) || isNaN(value)) {
                                        libCom.setInlineControlErrorVisibility(fdcControl.getCellProxyWithName(valueControl), false);
                                        fdcControl.getCellProxyWithName(valueControl).clearValidationOnValueChange();
                                        libCom.setInlineControlError(context, fdcControl.getCellProxyWithName(valueControl), context.localizeText('field_is_required'));
                                        context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getControl('FormCellContainer').redraw();
                                        foundError = true;
                                    } else {
                                        fdcControl.getCellProxyWithName(valueControl).clearValidationOnValueChange();
                                        context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getControl('FormCellContainer').redraw();
                                        MyButtonLib.setEditable(contextProxy, validateButtonName, true);
                                        calculateFormula = calculateFormula.replace(codes[j].Code,value);
                                    }
                                }
                            }
                        }
                    }
                    if (!charFound) {
                        reads.push(this.read(context, codes[j]));
                    }
                }
                if (!charFound) {
                    return Promise.all(reads).then((results) => {
                        let formulaexp = formula;
                        for (let k=0; k< codes.length; k++) {
                            formulaexp = formulaexp.replace(codes[k].Code,results[k]);
                        }
                        return this.evaluateExpression(formulaexp);
                    }).catch(() => {
                        return Promise.resolve(0);
                    });
                }
                if (!foundError) {
                    return Promise.resolve(this.evaluateExpression(calculateFormula));
                }
            }
        } catch (error) {
            Logger.info('calulateFormula - formula - ' + context.binding.Formula1 + ' ,error - ' + error);
        }
        return Promise.resolve(0);
    }

    static read(context, code) {
        let entity = `InspectionCharacteristics(InspectionLot='${context.binding.InspectionLot}',InspectionNode='${context.binding.InspectionNode}',InspectionChar='${code.Item}',SampleNum='${context.binding.SampleNum}')`;
        return context.read('/SAPAssetManager/Services/AssetManager.service', entity, [], '').then(result => {
            if (result && result.length > 0) {
                let row = result.getItem(0);
                if (row.hasOwnProperty(code.Property)) {
                    return row[code.Property];
                }
                return 0;
            }
            return 0;
        }).catch(() => {
            return 0;
        });
    }
    
    static evaluateExpression(expr) {
        let parens = /\(([0-9+\-*/\^ .]+)\)/;             // Regex for identifying parenthetical expressions
        let exp = /(\d+(?:\.\d+)?) ?\^ ?(\d+(?:\.\d+)?)/; // Regex for identifying exponentials (x ^ y)
        let mul = /(\d+(?:\.\d+)?) ?\* ?(\d+(?:\.\d+)?)/; // Regex for identifying multiplication (x * y)
        let div = /(\d+(?:\.\d+)?) ?\/ ?(\d+(?:\.\d+)?)/; // Regex for identifying division (x / y)
        let add = /(\d+(?:\.\d+)?) ?\+ ?(\d+(?:\.\d+)?)/; // Regex for identifying addition (x + y)
        let sub = /(\d+(?:\.\d+)?) ?- ?(\d+(?:\.\d+)?)/;  // Regex for identifying subtraction (x - y)
        
        if (isNaN(Number(expr))) {
            if (parens.test(expr)) {
                // eslint-disable-next-line no-unused-vars
                let newExpr = expr.replace(parens, function(match, subExpr) {
                    return libThis.evaluateExpression(subExpr);
                });
                return libThis.evaluateExpression(newExpr);
            } else if (exp.test(expr)) {
                // eslint-disable-next-line no-unused-vars
                let newExpr = expr.replace(exp, function(match, base, pow) {
                    return Math.pow(Number(base), Number(pow));
                });
                return libThis.evaluateExpression(newExpr);
            } else if (mul.test(expr)) {
                // eslint-disable-next-line no-unused-vars
                let newExpr = expr.replace(mul, function(match, a, b) {
                    return Number(a) * Number(b);
                });
                return libThis.evaluateExpression(newExpr);
            } else if (div.test(expr)) {
                // eslint-disable-next-line no-unused-vars
                let newExpr = expr.replace(div, function(match, a, b) {
                    if (b !== 0)
                        return Number(a) / Number(b);
                    else
                        throw new Error('Division by zero');
                });
                return libThis.evaluateExpression(newExpr);
            } else if (add.test(expr)) {
                // eslint-disable-next-line no-unused-vars
                let newExpr = expr.replace(add, function(match, a, b) {
                    return Number(a) + Number(b);
                });
                return libThis.evaluateExpression(newExpr);
            } else if (sub.test(expr)) {
                // eslint-disable-next-line no-unused-vars
                let newExpr = expr.replace(sub, function(match, a, b) {
                    return Number(a) - Number(b);
                });
                return libThis.evaluateExpression(newExpr);
            } else {
                return expr;
            }
        }
        return Number(expr);
    }

    static validateAllCharacteristics(context) {
        let rejectedChars = [];

        let fdcControl = context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getControl('FormCellContainer')._control;

        let sections = fdcControl.sectionsContexts;
        if (sections && sections.length > 0) {
            for (let i=0; i < sections.length; i++) {
                let section = sections[i];
                let odataType = section.binding['@odata.type'];
                if (odataType === '#sap_mobile.InspectionCharacteristic') {
                    libThis.validateCharacteristic(fdcControl, section, i, context);
                    if (!libVal.evalIsEmpty(section.binding.Valuation) && section.binding.Valuation === 'R') {
                        section.binding.UniqueId = `${section.binding.InspectionLot}-${section.binding.InspectionNode}-${section.binding.InspectionChar}-${section.binding.SampleNum}`; //need this to identify the characteristic
                        rejectedChars.push(section.binding.UniqueId);
                    }
                }
            }
        }

        context.evaluateTargetPathForAPI('#Page:InspectionCharacteristicsFDCUpdate').getClientData().RejectedChars = rejectedChars;
    }

    static validateCharacteristic(fdcControl, section, index, context) {
        let suffix = `_0_${index}`;
        if (libThis.isQuantitative(section.binding)) {
            let valueControl = 'QuantitativeValue' + suffix;
            let value = parseFloat(fdcControl.getCellProxyWithName(valueControl).getValue());
            this.setCharacteristicValuation(suffix, value, section, fdcControl, context);
        }
    }

    static setCharacteristicValuation(suffix, value, section, fdcControl, context) {
        let valuationControl = 'Valuation' + suffix;
        let validateExtensionName;
        let defectExtensionName;
        let validateButtonName;
        let recordDefectsButtonName;

        if (deviceType(context) === 'Tablet') {
            validateExtensionName = defectExtensionName = 'MyExtensionControlName';
            validateButtonName = 'ValidateOrCalculateButtonTablet';
            recordDefectsButtonName = 'RecordDefectsButtonTablet';
        } else {
            validateExtensionName = 'MyExtensionControlNameValidate';
            defectExtensionName = 'MyExtensionControlNameRecordDefect';
            validateButtonName = 'ValidateOrCalculateButton';
            recordDefectsButtonName = 'RecordDefectsButton';
        }

        let validateButtonStack = validateExtensionName + suffix;
        let validateContextProxy = fdcControl.getCellProxyWithName(validateButtonStack)._control._extension.context._clientAPI;

        let defectButtonStack = defectExtensionName + suffix;
        let defectContextProxy = fdcControl.getCellProxyWithName(defectButtonStack)._control._extension.context._clientAPI;
        if (value > 0) { //For the purposes of the filter, only validate if user entered a value
            let valueAccepted = false;
            if ((section.binding.TargetValue === value )) {
                valueAccepted = true;
            } else {
                if (section.binding.LowerLimitFlag === 'X' && section.binding.LowerLimit <= value) {
                    valueAccepted = true;
                }
                if (valueAccepted && section.binding.UpperLimitFlag === 'X') {
                    if (section.binding.UpperLimit >= value) {
                        valueAccepted = true;
                    } else {
                        valueAccepted = false;
                    }
                }
            }
            if (valueAccepted) {
                section.binding.Valuation='A';
                fdcControl.getCellProxyWithName(valuationControl).setValue("InspectionResultValuations('A')");
                if (libThis.isManualDefectRecordingEnable(context)) {
                    MyButtonLib.setEditable(defectContextProxy, recordDefectsButtonName, false);
                }
            } else {
                section.binding.Valuation='R';
                fdcControl.getCellProxyWithName(valuationControl).setValue("InspectionResultValuations('R')");
                if (libThis.isManualDefectRecordingEnable(context)) {
                    MyButtonLib.setEditable(defectContextProxy, recordDefectsButtonName, true);
                }
            }
            if (libThis.isQuantitative(section.binding)) {
                MyButtonLib.setTitle(validateContextProxy, validateButtonName, validateContextProxy.localizeText('validated'));
                MyButtonLib.setEditable(validateContextProxy, validateButtonName, false);
            }
        }
    }
}
