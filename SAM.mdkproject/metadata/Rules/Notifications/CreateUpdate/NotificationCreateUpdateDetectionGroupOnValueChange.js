import {SplitReadLink} from '../../Common/Library/ReadLinkUtils';
import libCommon from '../../Common/Library/CommonLibrary';

export default function NotificationCreateUpdateDetectionGroupOnValueChange(listPickerProxy) {
    //Filter the Detection Method list picker based on the selection of the Detection Group List picker
    let selection = listPickerProxy.getValue();
    let page = listPickerProxy.getPageProxy().getControl('FormCellContainer');
    
    let detectionMethodPicker = page.getControl('DetectionMethodListPicker');

    if (selection.length > 0) {
        let specifier = detectionMethodPicker.getTargetSpecifier();     
        let detectionGroupObject = SplitReadLink(libCommon.getListPickerValue(selection));
        let filter = `$filter=DetectionCatalog eq '${detectionGroupObject.DetectionCatalog}' and DetectionGroup eq '${detectionGroupObject.DetectionGroup}'&$orderby=DetectionCode`;

        specifier.setQueryOptions(filter);
        detectionMethodPicker.setValue('');
        detectionMethodPicker.setEditable(true);
        detectionMethodPicker.setTargetSpecifier(specifier);
        return Promise.resolve();
    } else {
        detectionMethodPicker.setValue('');
        detectionMethodPicker.setEditable(false);
        return Promise.resolve();
    }
}
