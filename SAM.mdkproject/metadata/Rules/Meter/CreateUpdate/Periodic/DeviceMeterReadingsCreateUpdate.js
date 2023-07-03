import libCommon from '../../../Common/Library/CommonLibrary';

export default function DeviceMeterReadingsCreateUpdate(context) {
    libCommon.setOnChangesetFlag(context, true);
    libCommon.resetChangeSetActionCounter(context);

    let extension = context.getControl('FormCellContainer')._control;
    
    let action = '/SAPAssetManager/Actions/Meters/CreateUpdate/Periodic/MeterReadingsCreateChangeSet.action';

    context.binding.RegisterReadCreateCount = 0;
    return extension.executeChangeSet(action, 1);
}
