/**
* Show/hide Note edit button based on parent object
* @param {IClientAPI} context
*/

export default function ShowNoteEdit(context) {
     // Enable note creation depending on the entity set
     const entityName = context.binding['@odata.type'].split('.')[1];
     switch (entityName) {
        case 'PurchaseOrderHeader':
            return false;
        default:
            return true;
     }
}
