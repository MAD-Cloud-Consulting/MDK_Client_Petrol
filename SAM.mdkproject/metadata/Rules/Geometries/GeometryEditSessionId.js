
export default function GeometryEditSessionId() {
    // for tracking each edit session for polyline or polygon
    // since title control is not able to show all ring or path of geomerty data.
    return Math.floor((1 + Math.random()) * 0x100000000).toString(16).substring(1);
}
