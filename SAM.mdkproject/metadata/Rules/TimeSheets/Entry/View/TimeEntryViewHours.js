
import ConvertDoubleToHourString from '../../../Confirmations/ConvertDoubleToHourString';
import {TimeSheetLibrary as libTS} from '../../TimeSheetLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
import userFeaturesLib from '../../../UserFeatures/UserFeaturesLibrary';
export default function TimeEntryViewHours(context) {
    let hours = 0;
    const binding = context.binding;
    if (userFeaturesLib.isFeatureEnabled(context, context.getGlobalDefinition('/SAPAssetManager/Globals/Features/Crew.global').getValue()) && !libVal.evalIsEmpty(binding) && binding.hasOwnProperty('CatsHours') && !libVal.evalIsEmpty(binding.CatsHours)) {
        hours = binding.CatsHours;
    } else if (!libVal.evalIsEmpty(binding) && binding.hasOwnProperty('Hours') && !libVal.evalIsEmpty(binding.Hours)) {
        hours = libTS.getActualHours(context, context.binding.Hours);
    }    
    return ConvertDoubleToHourString(hours);
}
