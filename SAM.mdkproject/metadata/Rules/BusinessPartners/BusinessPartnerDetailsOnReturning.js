import BusinessPartnerQueryOptions from './BusinessPartnerQueryOptions';
import FetchRequest from '../Common/Query/FetchRequest';

export default function BusinessPartnerDetailsOnReturning(context) {
    
    if (context.getClientData().didUpdateEntity) {
        return rebindPageObject(context).then(() => {
            
            context.getControl('SectionedTable')._context.binding = context._context.binding;
            context.getControl('SectionedTable').redraw();
            // Page has been updated
            context.getClientData().didUpdateEntity = false;
        });
    }
}

function rebindPageObject(context) {


    let queryOptions = BusinessPartnerQueryOptions();

    let readLink = context.getBindingObject()['@odata.readLink'];

    
    return new FetchRequest(readLink, queryOptions).get(context, readLink, true).then(result => {
        // Set the page binding to the updated object
        context._context.binding = result.getItem(0);
        return true;
    });
}
