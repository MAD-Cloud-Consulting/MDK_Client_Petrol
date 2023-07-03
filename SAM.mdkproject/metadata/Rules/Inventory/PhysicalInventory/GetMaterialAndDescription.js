export default function GetMaterialAndDescription(context) {

    let description = '';
    let material = context.binding.Material;

    if (context.binding.Material_Nav) {
        description = context.binding.Material_Nav.Description;
    }

    if (description) {
        return material + ' - ' + description;
    }
    return material;

}
