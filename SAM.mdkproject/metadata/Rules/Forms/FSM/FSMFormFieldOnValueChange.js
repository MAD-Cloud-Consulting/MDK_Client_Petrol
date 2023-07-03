import libForms from './FSMSmartFormsLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import isIOS from '../../Common/IsIOS';

/**
 * Handle hiding/showing fields/chapters that are tied to FSM smartform visibility rules
 * @param {*} context 
 * @returns 
 */
export default function FSMFormFieldOnValueChange(context, processAllRules=false) {

    let ruleMap = libCom.getStateVariable(context, 'FSMFormInstanceVisibilityRules');
    let fieldValues = libCom.getStateVariable(context, 'FSMFormInstanceControls');
    let elementsInRules = libCom.getStateVariable(context, 'FSMFormInstanceControlsInVisibilityRules');
    let chapterArray = libCom.getStateVariable(context, 'FSMFormInstanceChapters');
    let changedControlName;
    let extension;

    if (!processAllRules) {
        changedControlName = context.getName();
    }
    const pattern = new RegExp('\\b(' + changedControlName + ')\\b', 'i');

    for (const controlName in ruleMap) { //Loop over all rules
        if (processAllRules || (!processAllRules && ruleMap[controlName].Rule.match(pattern))) {  //Is this control that just had a value change referenced in this rule? 
            if (ruleMap[controlName].IsChapter) {
                let chapter = chapterArray[chapterArray.findIndex((row) => row.id === controlName)];
                let visible = libForms.calculateElementVisibility(context.getPageProxy(), controlName, ruleMap[controlName].Rule, fieldValues, elementsInRules);
                if (visible !== chapter.isVisible) {
                    chapter.isVisible = visible;
                    if (!chapter.isVisible) {
                        chapter.state = 4; //disabled
                    } else {
                        chapter.state = 0;
                    }
                    libForms.redrawToolbarButtons(context.getPageProxy()); //Refresh the previous/next buttons
                    if (!chapter.isSubChapter) { //Skip sub-chapters for extension
                        //Visibility changed, so Update the extension control with new chapter state
                        if (!extension) {
                            extension = libForms.getProgressExtensionControl(context);
                        }
                        let step = extension.getStep(chapter.extensionIndex);
                        step.State = chapter.state;
                        extension.updateStep(step, chapter.extensionIndex);
                    }
                    if (!processAllRules) {
                        //Reload the chapter picker to adjust options
                        let picker = context.getPageProxy().getControl('FormCellSectionedTable').getControl('ChapterListPicker');
                        picker.reset();
                        if (isIOS(context.getPageProxy())) {
                            context.setFocus();
                        }
                    }
                }
            } else { //Regular control - Only process this rule if rules's parent control exists on the current page
                let control = libCom.getControlProxy(context.getPageProxy(), controlName, 'FormCellSectionedTable');
                if (control) {
                    let oldVisible = control.visible;
                    let visible = libForms.calculateElementVisibility(context.getPageProxy(), controlName, ruleMap[controlName].Rule, fieldValues, elementsInRules);
                    if (visible !== oldVisible) { //Only redraw the field if the visibility state has changed
                        control.setVisible(visible);
                        fieldValues[controlName].IsVisible = visible;
                        if (!processAllRules && isIOS(context.getPageProxy())) {
                            context.setFocus();
                        }
                    }
                }
            }
        }
    }

}
