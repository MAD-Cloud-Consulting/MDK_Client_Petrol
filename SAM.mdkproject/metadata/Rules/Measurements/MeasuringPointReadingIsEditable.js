import libPoints from './MeasuringPointLibrary';
import libCommon from '../Common/Library/CommonLibrary';
export default function MeasuringPointReadingIsEditable(context) {
    let binding = context.binding;

    if (binding['@odata.type'] === '#sap_mobile.MyWorkOrderTool') {
        binding = binding.PRTPoint;
    }
    if (!binding.Point) {
        binding = binding.MeasuringPoint;
    }
    if (libCommon.IsOnCreate(context)) { //FDC or single reading create
        if (binding.CharName) { //Reading should only be enabled if a characteristic exists
            return true;
        }
        return false;
    }
    return !libPoints.validateIsCounter(binding) || binding.FromErrorArchive?true:false; //Do not allow editing a single counter reading 
}

