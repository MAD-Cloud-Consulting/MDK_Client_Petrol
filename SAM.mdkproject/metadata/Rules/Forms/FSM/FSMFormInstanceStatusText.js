export default function FSMFormsInstanceStatusText(context) {
    return (context.binding.Closed) ? context.localizeText('complete'): context.localizeText('open');
}
