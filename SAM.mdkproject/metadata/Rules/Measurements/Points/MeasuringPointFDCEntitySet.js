import libCommon from '../../Common/Library/CommonLibrary';
export default function MeasuringPointFDCEntitySet(context) {
    let binding = context.getPageProxy().binding;

    if (!binding || binding.constructor.name !== 'Object') {
        binding = context.binding;
    }
    if (libCommon.isDefined(binding)) {
        let odataType = binding['@odata.type'];
        let operation = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderOperation.global').getValue();
        let equipment = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Equipment.global').getValue();
        let floc = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/FunctionalLocation.global').getValue();
        switch (odataType) {
            case operation:
              return binding['@odata.readLink'] + '/Tools';
            case equipment:
              return binding['@odata.readLink'] + '/MeasuringPoints';
            case floc:
              return binding['@odata.readLink'] + '/MeasuringPoints';
            default:
              return 'MeasuringPoints';
        }
    }

}
