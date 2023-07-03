export default function LAMCharacteristicValueStartPoint(context) {
    return context.evaluateTargetPath('#Control:StartPoint/#Value').toString();
}
