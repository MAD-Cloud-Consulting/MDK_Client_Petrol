export default function PhysicalInventoryDocRefAndNo(context) {

    let binding = context.binding;
    let ref = binding.Physinventref;
    let no = binding.PhysInvNo;
    
    if (ref && no) {
        return ref + '/' + no;
    } else if (ref) {
        return ref;
    } else if (no) {
        return no;
    }
    return '';
}
