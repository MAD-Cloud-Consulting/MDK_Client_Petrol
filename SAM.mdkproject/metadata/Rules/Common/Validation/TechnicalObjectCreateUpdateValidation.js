import DocumentLibrary from '../../Documents/DocumentLibrary';
import DescriptionNoteControl from '../Controls/DescriptionNoteControl';

export default function createUpdateValidationRule(pageProxy) {
    let valPromises = [];

    let formCellContainer = pageProxy.getControl('FormCellContainer');
    let allControls = formCellContainer.getControls();
    for (let item of allControls) {
         item.clearValidationOnValueChange();
    }
    formCellContainer.redraw();

    // get all of the validation promises
    valPromises.push(DescriptionNoteControl.validationCharLimit(pageProxy));

    // check attachment count, run the validation rule if there is an attachment
    if (DocumentLibrary.attachmentSectionHasData(pageProxy)) {
        valPromises.push(DocumentLibrary.createValidationRule(pageProxy));
    }

    // check all validation promises;
    // if all resolved -> return true
    // if at least 1 rejected -> return false
    return Promise.all(valPromises).then((results) => {
        const pass = results.reduce((total, value) => {
            return total && value;
        });
        if (!pass) {
            throw false;
        }
        return true;
    }).catch(() => {
        return false;
    });
}
