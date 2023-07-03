import { TimeSheetLibrary as libTime} from '../../TimeSheetLibrary';

export default function TimeSheetEntryGetActualMinutes(context) {

    let binding = context.binding;
    return libTime.getActualHours(context, binding.Hours); //Convert the possibly rounded time back to unrounded for duration control
 
}
