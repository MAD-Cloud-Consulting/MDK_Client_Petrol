import authorizedFinalConfirmation from '../../UserAuthorizations/Confirmations/EnableFinalConfirmationCreate';
export default function IsFinalConfirmationVisible(context) {
    if (context.getBindingObject().IsFromWorkOrderHold) {
        return !context.getBindingObject().IsFromWorkOrderHold;
    }
    return authorizedFinalConfirmation(context);
}
