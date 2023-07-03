

export default function PageTitle(context) {

    let descriptor = context.getBindingObject().IsOnCreate ? 'create' : 'update';
    return context.localizeText(`confirmation_${descriptor}_title`);
}
