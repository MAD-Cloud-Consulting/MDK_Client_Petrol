import libCommon from './Library/CommonLibrary';
import IsAndroid from './IsAndroid';

export default function UpdateRequiredFailed(pageProxy) {
    
    //first remove all previous validation - this is only temporary, once we get onValueChange() function for
    //Note control, we can remove the following - TODO
    let formCellContainer = pageProxy.getControl('FormCellContainer');
    let allControls = formCellContainer.getControls();
    for (let item of allControls) {
         item.clearValidationOnValueChange();
    }
    formCellContainer.redraw();

    //get the missing fields
    let missingRequiredFields = pageProxy.getMissingRequiredControls();
    let message = pageProxy.localizeText('field_is_required');

    //set the inline error
    let promises = [];
    for (let control of missingRequiredFields) {
        promises.push(libCommon.executeInlineControlError(pageProxy, control, message));
    }

    return Promise.all(promises).finally(() => {
        if (IsAndroid(pageProxy)) {
            pageProxy.redraw();
        }
    });
}
