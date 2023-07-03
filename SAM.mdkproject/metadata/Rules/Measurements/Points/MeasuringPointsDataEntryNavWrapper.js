import libCom from '../../Common/Library/CommonLibrary';

export default function MeasuringPointsDataEntryNavWrapper(context) {

    if (!context) {
        throw new TypeError('Context can\'t be null or undefined');
    }

    //Remove old readings from memory
    libCom.setStateVariable(context, 'TransactionType', 'CREATE');
    libCom.setStateVariable(context, 'ReadingType','MULTIPLE');
    libCom.removeStateVariable(context, 'TempPointDefaults'); //Reset the local defaults
    return context.executeAction('/SAPAssetManager/Actions/Measurements/MeasuringPointsDataEntryNav.action');
}
