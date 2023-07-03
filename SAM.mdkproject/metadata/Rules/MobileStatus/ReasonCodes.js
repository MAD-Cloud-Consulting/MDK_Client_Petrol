import {GlobalVar as GlobalClass} from '../Common/Library/GlobalCommon';

export default function ReasonCodes(context) {
    let reason = GlobalClass.getAppParam().REASON;
    let codes = Object.keys(reason).map((k) => reason[k]);

    let output = [];

    for (var i in codes) {
        output.push(context.localizeText(codes[i]));
    }

    return output;
}
