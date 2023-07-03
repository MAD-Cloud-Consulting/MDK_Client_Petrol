import libCom from '../Common/Library/CommonLibrary';
import ChecklistAllowDiscard from './ChecklistAllowDiscard';

export default function checklistUpdateOnLoaded(context) {
    libCom.saveInitialValues(context);

    //Set the discard button's visibility based on whether checklist is local or not
    let discard = libCom.getControlDictionaryFromPage(context).DiscardButton;
    discard.setVisible(ChecklistAllowDiscard(context));
    discard.setStyle('ObjectCellStyleRed', 'Value');

}
