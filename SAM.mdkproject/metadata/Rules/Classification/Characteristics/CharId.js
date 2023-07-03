/**
 * CharId
 * Send the char id from either Characteristic if the Char is locally created or
 * from Object level
 * @param context
 * @returns charId
 */
import libVal from '../../Common/Library/ValidationLibrary';
export default function CharId(context) {
    return libVal.evalIsEmpty(context.binding.CharId) ? context.binding.Characteristic.CharId : context.binding.CharId;
}
