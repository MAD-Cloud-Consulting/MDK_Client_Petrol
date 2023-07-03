
export default function WorkOrderReadLink(context) {
    if (context.currentPage.woBinding) {
        let binding = context.currentPage.woBinding;
        return binding['@odata.editLink'];
    }
    return '';
}
