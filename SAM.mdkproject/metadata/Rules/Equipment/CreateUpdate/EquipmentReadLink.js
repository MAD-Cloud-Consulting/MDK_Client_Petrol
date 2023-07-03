
export default function EquipmentReadLink(context) {
    if (context.currentPage.equipBinding) {
        let binding = context.currentPage.equipBinding;
        return binding['@odata.editLink'];
    }
    return '';
}
