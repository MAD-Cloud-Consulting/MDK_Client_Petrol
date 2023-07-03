import libCommon from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import countDecimals from '../../../../SAPAssetManager/Rules/Classification/Characteristics/Validation/CharacteristicsCountDecimal';
import localization from '../../Common/Library/LocalizationLibrary';

export default function MeterReadingCreateUpdateValidation(context) {

    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    let now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    now.setDate(now.getDate() + 1);

    let dict = {};

    libCommon.getFieldValue(context, 'ReadingValue', '', dict, true);
    libCommon.getFieldValue(context, 'ReadingTimeControl', '', dict, true);
    libCommon.getFieldValue(context, 'PeakTimeSwitch', '', dict, true);
    libCommon.getFieldValue(context, 'PeakUsageTimeControl', '', dict, true);
    libCommon.getFieldValue(context, 'NotePicker', '', dict, true);
    dict.NotePicker = libCommon.getListPickerValue(dict.NotePicker);


    libCommon.getControlProxy(context, 'ReadingValue').clearValidation();
    libCommon.getControlProxy(context, 'ReadingTimeControl').clearValidation();
    libCommon.getControlProxy(context, 'PeakUsageTimeControl').clearValidation();

    let estimateReadingNote = libCommon.getAppParam(context, 'METERREADINGNOTE', 'EstimateMeterReading');

    let result = true;

    let message = '';

    if (libVal.evalIsEmpty(dict.ReadingValue) && !(dict.NotePicker === estimateReadingNote)) {
        result = false;
        message = context.localizeText('field_is_required');
        libCommon.executeInlineControlError(context, libCommon.getControlProxy(context, 'ReadingValue'), message);
    }

    if (dict.ReadingTimeControl >= now) {
        result = false;
        message = context.localizeText('validation_reading_time_cannot_be_in_the_future');
        libCommon.executeInlineControlError(context, libCommon.getControlProxy(context, 'ReadingTimeControl'), message);
    }

    if ( dict.PeakTimeSwitch
        && dict.PeakUsageTimeControl >= now ) {
        result = false;
        message = context.localizeText('validation_peak_reading_time_cannot_be_in_the_future');
        libCommon.executeInlineControlError(context, libCommon.getControlProxy(context, 'PeakUsageTimeControl'), message);
    }

    if (!localization.isNumber(context, dict.ReadingValue)) {
        result = false;
        message = context.localizeText('validation_reading_is_numeric');
        libCommon.executeInlineControlError(context, libCommon.getControlProxy(context, 'ReadingValue'), message);
    }

    if (countDecimals(localization.toNumber(context, dict.ReadingValue)) > Number(context.binding.DecimalAfter)) {
        result = false;
        let dynamicParams = [Number(context.binding.DecimalAfter)];
        message = context.localizeText('max_number_of_decimals', dynamicParams);
        libCommon.executeInlineControlError(context, libCommon.getControlProxy(context, 'ReadingValue'), message);
    }

    if (((countDecimals(localization.toNumber(context, dict.ReadingValue)) > 0) ? dict.ReadingValue.length - countDecimals(localization.toNumber(context, dict.ReadingValue)) - 1 : dict.ReadingValue.length) > Number(context.binding.DecimalBefore)) {
        result = false;
        let dynamicParams = [Number(context.binding.DecimalBefore)];
        message = context.localizeText('max_number_of_char', dynamicParams);
        libCommon.executeInlineControlError(context, libCommon.getControlProxy(context, 'ReadingValue'), message);
    }

    return result;
}
