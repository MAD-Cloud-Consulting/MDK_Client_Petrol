
export default function MaterialDocumentType(context) {
    switch (context.binding.GMCode) {
       case '01':
          return context.binding.GMCode + ' - ' + context.localizeText('gm_code_01');
        case '02':
            return context.binding.GMCode + ' - ' + context.localizeText('gm_code_02');
        case '03':
            return context.binding.GMCode + ' - ' + context.localizeText('gm_code_03');
        case '04':
            return context.binding.GMCode + ' - ' + context.localizeText('gm_code_04');
        case '05':
            return context.binding.GMCode + ' - ' + context.localizeText('gm_code_05');
        case '06':
            return context.binding.GMCode + ' - ' + context.localizeText('gm_code_06');
        case '07':
            return context.binding.GMCode + ' - ' + context.localizeText('gm_code_07');
       default:
            return context.binding.GMCode ;
    }
}
