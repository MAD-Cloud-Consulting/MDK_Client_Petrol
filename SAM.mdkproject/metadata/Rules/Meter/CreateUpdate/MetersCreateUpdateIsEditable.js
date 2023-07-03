import libMeter from '../../Meter/Common/MeterLibrary';
export default function MetersCreateUpdateIsEditable(context) {
    let binding = context.getPageProxy().binding;
    let controlName = context.getName();
    let meterTransactionType = libMeter.getMeterTransactionType(context);

    if (meterTransactionType === 'INSTALL' || meterTransactionType === 'REP_INST') {
        switch (controlName) {
            case 'DeviceLocationLstPkr':
                return (binding.DeviceLocation === '');
            case 'PremiseLstPkr':
                return (binding.Premise === '');
            case 'InstallationLstPkr':
                return (binding.Installation === '');
            default:
                return true;
        }
    }

    return false;
}

