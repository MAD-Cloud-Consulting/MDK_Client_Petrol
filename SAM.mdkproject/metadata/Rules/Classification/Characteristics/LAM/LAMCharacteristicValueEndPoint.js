export default function LAMCharacteristicValueEndPoint(context) {
    return context.evaluateTargetPath('#Control:EndPoint/#Value').toString();
}
