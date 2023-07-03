import localization from '../../../SAPAssetManager/Rules/Common/Library/LocalizationLibrary';

export default function ReadingValueAsDouble(context) {
    return localization.toNumber(context, context.evaluateTargetPath('#Control:ReadingValue/#Value'), '', false);
}
