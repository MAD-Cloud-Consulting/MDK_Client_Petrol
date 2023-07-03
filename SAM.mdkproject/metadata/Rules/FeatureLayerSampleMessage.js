export default function FeatureLayerSampleMessage(context) {
    let extension = context.currentPage.controls[0];
    let object = extension.getLastCallbackData();
    let json = JSON.stringify(object);
    return json.length < 300 ? json : json.slice(0, 300) + '...';
}
