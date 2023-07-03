export default function GetMaterialName(clientAPI, item) {
    var document = item || clientAPI.binding;
    var material = document.Material;
    if (!material) {
        material = document.MaterialNum;
    }
    var queryOption = "$filter=MaterialNum eq '" + material + "'";
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'Materials', [], queryOption).then((result) => {
        if (result && result.length > 0) {
            var name = result.getItem(0).Description;            
            return name;	
        } else {
            return material;
        }
    });
}
