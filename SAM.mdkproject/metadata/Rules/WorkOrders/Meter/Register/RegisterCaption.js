export default function RegisterCaption(context) {
    return context.localizeText('register') + ' ' + (context.binding.RegisterNum ? context.binding.RegisterNum : context.binding.Register);
}
