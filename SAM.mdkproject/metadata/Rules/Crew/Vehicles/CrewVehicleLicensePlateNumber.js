import libVal from '../../Common/Library/ValidationLibrary';

export default function CrewVehicleLicensePlateNumber(context) {
    
    const binding = context.binding.Fleet;
    if (libVal.evalIsEmpty(binding.LicensePlateNumber)) {
        return context.localizeText('none');
    } else {
        return binding.LicensePlateNumber;
    }

}
