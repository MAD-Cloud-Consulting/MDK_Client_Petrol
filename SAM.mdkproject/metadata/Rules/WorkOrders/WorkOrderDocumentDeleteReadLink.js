export default function WorkOrderDocumentDeleteReadLink(context) {
    if (context.getClientData().DeletedDocReadLinks.length) {
        return context.getClientData().DeletedDocReadLinks.shift();
    }
}
