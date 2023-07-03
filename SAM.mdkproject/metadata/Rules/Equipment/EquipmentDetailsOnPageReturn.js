export default function EquipmentDetailsOnPageReturn(clientAPI) {
    clientAPI
        .getPageProxy()
        .getControl('SectionedTable')
        .getSection('SubEquipmentSection')
        .redraw(true);
}
