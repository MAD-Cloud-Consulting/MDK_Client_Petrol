
export default class CascadingAction {

    constructor(args = {}, actionQueue=[]) {
        // Set the arguments
        this.setArgs(args);
        this.setActionQueue(actionQueue);
        this.didExecute = false;
    }

    name() {
        return typeof this;
    }

    getDefaultArgs() {
        return {};
    }

    setArgs(args) {

        for (const [key, value] of Object.entries(this.getDefaultArgs())) {
            if (args[key] === undefined) {
                args[key] = value;
            }
        }

        this.args = args;
    }

    setActionQueue(actionQueue) {
        this.actionQueue = actionQueue;
    }

    pushLinkedAction(cascadingAction, before=[]) {

        if (this.name() === cascadingAction.name()) {
            // Return without linking a dupe action
            return;
        }

        if (this.nextAction === undefined) {
            this.nextAction = cascadingAction;
            return;
        }

        if (before.includes(this.nextAction.name())) {
            // The next action in the chain is an action this one needs to be executed before
            cascadingAction.nextAction = this.nextAction;
            this.nextAction = cascadingAction;
            return;
        }

        this.nextAction.pushLinkedAction(cascadingAction);
        
    }

    execute(context) {

        if (this.actionQueue.length <= 0) {
            this.didExecute = true;

            if (this.nextAction !== undefined) {
                // If there's another cascading action in the chain, call it
                // This is useful for chaining unrelated actions together
                return this.nextAction.execute(context);
            }

            // Base condition
            // If this is the end of the execution queue
            return Promise.resolve(true);
        }

        let action = this.actionQueue.shift();

        // Recursively call and wait on each action
        return action(context, this).then(() => {
            return this.execute(context);
        });
    }

}
