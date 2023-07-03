import errorVal from '../Common/Library/ErrorLibrary';

export default function SyncErrorFormat(context) {
    var section = context.getName();
    var property = context.getProperty();
    switch (section) {
        case 'SyncErrorObjectTable':
            switch (property) {
                case 'Title':
                    return errorVal.getErrorMessage(context);
                case 'Subhead':
                   //return errorVal.getErrorCode(context);
                   return '';
                case 'Description':
                    return '';
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return errorVal.getErrorMessage(context);
}
