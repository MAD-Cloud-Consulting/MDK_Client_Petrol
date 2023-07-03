import EnableFieldServiceTechnician from '../../SideDrawer/EnableFieldServiceTechnician';
import libCom from '../../Common/Library/CommonLibrary';

/**
* Redraw control manually to display updated data after edit
*/
export default function MaterialDocDetailsOnPageReturn(pageProxy) {
    let isVehicle = EnableFieldServiceTechnician(pageProxy) && libCom.getPreviousPageName(pageProxy) === 'MaterialDocumentRecentList';
    if (isVehicle) {
        libCom.setStateVariable(pageProxy, 'TempLine_MatDocItemReadLink', '');
        libCom.setStateVariable(pageProxy, 'TempLine_MatDocItem', '');
    }
    pageProxy.getControl('SectionedTable0').redraw();
}
