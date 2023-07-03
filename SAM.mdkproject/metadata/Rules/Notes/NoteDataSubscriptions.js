import { NoteLibrary as NoteLib } from './NoteLibrary';

export default function NoteDataSubscriptions(context) {
    let subscriptions = [];
    let transactionType = NoteLib.getNoteTypeTransactionFlag(context);
    if (transactionType && transactionType.longTextEntitySet) {
        subscriptions.push(transactionType.longTextEntitySet);
    }
    return subscriptions;
}
