import QueryBuilder from '../../../Common/Query/QueryBuilder';

/**
* This function will return the query options to show the Issued Serial Numbers that the user can Return
* @param {IClientAPI} context
*/
export default function PartSerialNumQueryOptions(context, movementType) {

    let binding = context.binding;
    let queryBuilder = new QueryBuilder();
    let filterOpts = [];

    if (binding.OrderId) {
        filterOpts.push(`MatDocItem_Nav/OrderNumber eq '${binding.OrderId}'`);
    }

    if (binding.ItemNumber) {
        filterOpts.push(`MatDocItem_Nav/ReservationItemNumber eq '${binding.ItemNumber}'`);
    }

    if (binding.RequirementNumber) {
        filterOpts.push(`MatDocItem_Nav/ReservationNumber eq '${binding.RequirementNumber}'`);
    }

    if (binding.MaterialNum) {
        filterOpts.push(`MatDocItem_Nav/Material eq '${binding.MaterialNum}'`);
    }

    if (movementType) {
        filterOpts.push(`MatDocItem_Nav/MovementType eq '${movementType}'`);
    }


    queryBuilder.addAllFilters(filterOpts);

    return queryBuilder.build();

}

