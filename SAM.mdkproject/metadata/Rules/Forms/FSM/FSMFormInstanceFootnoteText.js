export default function FSMFormsInstanceFootnoteText(context) {
    let binding = context.binding;
    
    if (binding.Description) {
        return binding.Description;
    }
    if (binding.FSMFormTemplate_Nav.Description) {
        return binding.FSMFormTemplate_Nav.Description;
    }
    return '-';
}
