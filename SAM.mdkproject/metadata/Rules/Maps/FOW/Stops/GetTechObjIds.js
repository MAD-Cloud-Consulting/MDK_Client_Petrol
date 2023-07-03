export function getTechObjIds(context, techObjName) {
    let techObjcIds = [];
    let techObjs = context.binding.TechObjects;
    if (techObjs) {
        techObjs.forEach(techObj => {
            if (techObj[techObjName]) {
                techObjcIds.push(techObj[techObjName]);
            }
        });
    }
    return techObjcIds;
}
