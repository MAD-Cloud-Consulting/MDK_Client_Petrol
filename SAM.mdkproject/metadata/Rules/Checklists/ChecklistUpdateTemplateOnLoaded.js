import libCommon from '../Common/Library/CommonLibrary';
import Stylizer from '../Common/Style/Stylizer';

export default function checklistUpdateTemplateOnLoaded(context) {

    let controls = libCommon.getControlDictionaryFromPage(context);
    let textEntryStyle = new Stylizer(['FormCellTextEntry']);
    textEntryStyle.apply(controls.Question, 'Value');

}
