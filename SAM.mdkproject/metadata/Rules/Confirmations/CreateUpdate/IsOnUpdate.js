
export default function IsOnUpdate(context) {
    return !context.getBindingObject().IsOnCreate;
}
