import toolbarCaption from './MobileStatus/OperationMobileStatusToolBarCaption';
import progressTrackerUpdate from '../TimelineControl/ProgressTrackerOnDataChanged';

export default function WorkOrderOperationDetailsOnReturning(context) {
    return toolbarCaption(context).then(caption => {
        context.setToolbarItemCaption('IssuePartTbI', caption);
        return progressTrackerUpdate(context);
    });
}
