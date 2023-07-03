import isWOCreateEnabled from '../UserAuthorizations/WorkOrders/EnableWorkOrderCreate';
export default function WorkOrderIsSamePlanningPlant(context) {
    return isWOCreateEnabled(context);
}
