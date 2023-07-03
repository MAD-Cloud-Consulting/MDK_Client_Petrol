export default function InspectionMethodLongText(context) {
    let binding = context.binding.InspectionMethod_Nav;
    if (binding && binding.LongTextFlag === 'X') {
        return binding.MethodLongText_Nav.TextString;
    }
    return '-';
}
