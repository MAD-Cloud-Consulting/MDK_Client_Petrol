export default function LAMEditButton(context) {
    let odataType = context.binding.ObjectType;
    let isVisible = true;
    switch (odataType) {
        case 'IF': //Functional location'
            isVisible = false;
            break;
        case 'IE': //Equipment
            isVisible = false;
            break;
        case 'ML': //Measuring point
            isVisible = false;
            break;
        default:
            break;
    }
    return  isVisible;
}
