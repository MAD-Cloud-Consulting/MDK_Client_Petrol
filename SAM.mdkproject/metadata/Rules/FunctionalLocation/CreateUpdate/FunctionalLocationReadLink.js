
export default function FunctionalLocationReadLink(context) {
    if (context.currentPage.funcLocBinding) {
        let binding = context.currentPage.funcLocBinding;
        return binding['@odata.editLink'];
    }
    return '';
}
