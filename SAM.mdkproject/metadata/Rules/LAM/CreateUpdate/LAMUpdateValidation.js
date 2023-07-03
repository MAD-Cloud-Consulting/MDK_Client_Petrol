import libCom from '../../Common/Library/CommonLibrary';
import libLocal from '../../Common/Library/LocalizationLibrary';

export default function LAMUpdatevalidation(context) {
    var dict = libCom.getControlDictionaryFromPage(context);
    let LRPLstPkr = Object.keys(dict).find(control => control.includes('LRPLstPkr'));
    let StartPoint = Object.keys(dict).find(control => control.includes('StartPoint'));
    let Length = Object.keys(dict).find(control => control.includes('Length'));
    let UOMLstPkr = Object.keys(dict).find(control => control.includes('UOMLstPkr'));
    let MarkerUOMLstPkr =Object.keys(dict).find(control => control.includes('MarkerUOMLstPkr'));
    let Offset1TypeLstPkr = Object.keys(dict).find(control => control.includes('1TypeLstPkr'));
    let Offset1 = Object.keys(dict).find(control => control.includes('offset1'));
    let Offset1UOMLstPkr = Object.keys(dict).find(control => control.includes('Offset1UOMLstPkr'));
    let Offset2TypeLstPkr = Object.keys(dict).find(control => control.includes('2TypeLstPkr'));
    let Offset2 = Object.keys(dict).find(control => control.includes('offset2'));
    let Offset2UOMLstPkr = Object.keys(dict).find(control => control.includes('Offset2UOMLstPkr'));
    let DistanceFromEnd = Object.keys(dict).find(control => control.includes('DistanceFromEnd'));
    let DistanceFromStart = Object.keys(dict).find(control => control.includes('DistanceFromStart'));
    let StartMarkerLstPkr = Object.keys(dict).find(control => control.includes('StartMarkerLstPkr'));
    let EndMarkerLstPkr =Object.keys(dict).find(control => control.includes('EndMarkerLstPkr'));
    dict[LRPLstPkr].clearValidation();
    dict[StartPoint].clearValidation();
    dict[Length].clearValidation();
    dict[UOMLstPkr].clearValidation();
    dict[StartMarkerLstPkr].clearValidation();
    dict[DistanceFromStart].clearValidation();
    dict[EndMarkerLstPkr].clearValidation();
    dict[DistanceFromEnd].clearValidation();
    dict[MarkerUOMLstPkr].clearValidation();
    dict[Offset1TypeLstPkr].clearValidation();
    dict[Offset1].clearValidation();
    dict[Offset1UOMLstPkr].clearValidation();
    dict[Offset2TypeLstPkr].clearValidation();
    dict[Offset2].clearValidation();
    dict[Offset2UOMLstPkr].clearValidation();

    let validations = [];

    validations.push(validateStartPointReadingIsNumeric(context, dict));
    validations.push(validateEndPointReadingIsNumeric(context, dict));
    validations.push(validateLengthIsPositive(context, dict));
    validations.push(validateOffsets(context, dict));
    validations.push(validateRequiredField(context, dict[UOMLstPkr]));
    if (dict[MarkerUOMLstPkr]._control.observable().builder.builtData.IsEditable === true)
        validations.push(validateRequiredField(context, dict[MarkerUOMLstPkr]));
    if (libCom.isDefined(dict[Offset1].getValue())) {
        validations.push(validateRequiredField(context, dict[Offset1TypeLstPkr]));
    }
    if (libCom.isDefined(dict[Offset2].getValue())) {
        validations.push(validateRequiredField(context, dict[Offset2TypeLstPkr]));
    }

    return Promise.all(validations).then(() => {
        return true;
    }).catch(() => {
        return false;
    });

}

    /**
     * Validate Length is positive
     */

    function validateLengthIsPositive(context, dict) {
        let Length = Object.keys(dict).find(control => control.includes('Length'));
        if (libLocal.toNumber(context, dict[Length].getValue()) > 0) {
            return Promise.resolve(true);
        } else {
            let message = context.localizeText('positive_length');
            libCom.executeInlineControlError(context, dict[Length], message);
            dict.InlineErrorsExist = true;
            return Promise.reject(false);
        }
    }

    /**
     * Start Point reading must be numeric for decimal separator according to the device's local.
     */
    function validateStartPointReadingIsNumeric(context, dict) {
        let StartPoint = Object.keys(dict).find(control => control.includes('StartPoint'));
        if (libLocal.isNumber(context, dict[StartPoint].getValue())) {
            return Promise.resolve(true);
        } else {
            let message = context.localizeText('start_point_is_required');
            libCom.executeInlineControlError(context, dict[StartPoint], message);
            dict.InlineErrorsExist = true;
            return Promise.reject(false);
        }
    }

    /**
     * End Point reading must be numeric for decimal separator according to the device's local.
     */
    function validateEndPointReadingIsNumeric(context, dict) {
        let EndPoint = Object.keys(dict).find(control => control.includes('EndPoint'));
        if (libLocal.isNumber(context, dict[EndPoint].getValue())) {
            return Promise.resolve(true);
        } else {
            let message = context.localizeText('end_point_is_required');
            libCom.executeInlineControlError(context,  dict[EndPoint], message);
            dict.InlineErrorsExist = true;
            return Promise.reject(false);
        }
    }
    /**
     * Check UOM for each picker
     * @param {*} context
     * @param {*} control
     */
    function validateRequiredField(context,control) {
        if (!libCom.isDefined(control.getValue())) {
            let message = context.localizeText('field_is_required');
            libCom.executeInlineControlError(context, control, message);
            return Promise.reject();
        } else {
            return Promise.resolve(true);
        }

    }

    function validateOffsets(context, dict) {
        ///Check pickers that pickers have a value. Resolve promise if both are empty. If not verify that are types are different
        let Offset1TypeLstPkr = Object.keys(dict).find(control => control.includes('1TypeLstPkr'));
        let Offset2TypeLstPkr = Object.keys(dict).find(control => control.includes('2TypeLstPkr'));
        let Offset1 = Object.keys(dict).find(control => control.includes('offset1'));
        let Offset2 = Object.keys(dict).find(control => control.includes('offset2'));
        if (libCom.isDefined(dict[Offset1TypeLstPkr].getValue()) && libCom.isDefined(dict[Offset2TypeLstPkr].getValue())) {
            //Offset types must be different
            if (dict[Offset1TypeLstPkr].getValue()[0].ReturnValue === dict[Offset2TypeLstPkr].getValue()[0].ReturnValue) {
            let message = context.localizeText('validation_offsets_types_are_same');
            libCom.executeInlineControlError(context, dict[Offset1TypeLstPkr], message);
            libCom.executeInlineControlError(context, dict[Offset2TypeLstPkr], message);
            dict.InlineErrorsExist = true;
            return Promise.reject();
            } else {
                ///Check offsets are numeric
                if (libLocal.isNumber(context, dict[Offset1].getValue()) && libLocal.isNumber(context, dict[Offset2].getValue())) {
                    return Promise.resolve(true);
                } else {
                    let message = context.localizeText('validation_reading_is_numeric');
                    libCom.executeInlineControlError(context, dict[Offset1], message);
                    libCom.executeInlineControlError(context, dict[Offset2], message);
                    return Promise.reject();
                }
            }
        } else {
            return Promise.resolve(true);
        }
    }
