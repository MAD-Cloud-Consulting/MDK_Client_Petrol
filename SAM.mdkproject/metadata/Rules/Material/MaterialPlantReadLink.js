export default function MaterialPlantReadLink(context) {
    return "MaterialPlants(MaterialNum='" + context.getClientData().MaterialNum + "',Plant='" + context.getClientData().Plant + "')";
}
