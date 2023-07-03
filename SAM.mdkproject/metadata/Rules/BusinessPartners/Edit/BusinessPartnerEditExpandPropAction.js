import CascadingAction from '../../Common/Action/CascadingAction';


export class BusinessPartnerEditExpandPropAction extends CascadingAction {

    name() {
        return this.args.name;
    }

    setActionQueue(actionQueue) {
        actionQueue.push(this.executeUpdateAction);
        super.setActionQueue(actionQueue);
    }

    executeUpdateAction(context, instance) {

        for (const [key, value] of Object.entries(instance.args.clientDataInfo)) {
            // Iterate over the client data array
            // Set info as specified
            context.getClientData()[key] = value;
        }
        
        return context.executeAction(instance.args.action);
    }

}
