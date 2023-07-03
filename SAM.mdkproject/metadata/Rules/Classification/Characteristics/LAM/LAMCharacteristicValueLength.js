export default function LAMCharacteristicValueLength(context) {

    return context.evaluateTargetPath('#Control:Length/#Value').toString();

}
