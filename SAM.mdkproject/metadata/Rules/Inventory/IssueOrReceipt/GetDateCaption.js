import enableItemsScreen from '../MaterialDocument/EnableItemsScreen';

export default function GetDateCaption(context) {
    let res = enableItemsScreen(context);
    if (res) {
        return context.localizeText('posting_date');
    }
    return context.localizeText('document_date');
}
