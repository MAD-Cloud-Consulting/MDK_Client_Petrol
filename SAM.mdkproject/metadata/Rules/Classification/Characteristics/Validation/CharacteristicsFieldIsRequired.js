import libCommon from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
export default function CharacteristicsFieldIsRequired(context, value, control) {
    if (!libVal.evalIsEmpty(context.binding.Characteristic.EntryRequired) && libVal.evalIsEmpty(value)) {
        let message = context.localizeText('field_is_required');
        return libCommon.executeInlineControlError(context, control, message);
    }
    return true;
}
