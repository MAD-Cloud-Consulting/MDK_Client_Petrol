import setSubEquipmentListViewPageCaption from './SubEquipmentListViewPageCaption';

export default function SubEquipmentOnPageReturning(clientAPI) {
    clientAPI.getPageProxy().getControl('SectionedTable').redraw();
    setSubEquipmentListViewPageCaption(clientAPI);
}
