import DocumentsIsVisible from './DocumentsIsVisible';
import EnableWorkOrderEdit from '../UserAuthorizations/WorkOrders/EnableWorkOrderEdit';

export default function DocumentAddFromOperationDetails(clientAPI) {
    if (DocumentsIsVisible(clientAPI)) {
        return EnableWorkOrderEdit(clientAPI).then(isEditEnabled => {
            return isEditEnabled;
        });
    }

    return Promise.resolve(false);
}
