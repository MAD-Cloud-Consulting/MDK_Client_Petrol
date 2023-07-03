import caption from './FunctionalLocationCaption';

export default function SetFunctionalLocationCaption(context) {
    return caption(context).then(result => {
        context.setCaption(result);
    });
}
