export default function FSMFormsInstanceMandatoryText(context) {
    return (context.binding.Mandatory) ? context.localizeText('mandatory'): context.localizeText('optional');
}
