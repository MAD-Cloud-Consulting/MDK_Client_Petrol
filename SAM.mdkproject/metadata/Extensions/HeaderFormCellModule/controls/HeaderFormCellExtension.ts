import { BaseControl } from 'mdk-core/controls/BaseControl';
import { HeaderFormCell } from './HeaderFormCellPlugin/HeaderFormCell'

export class HeaderFormCellClass extends BaseControl {
  private _labelContainer: HeaderFormCell;

  public initialize(props) {
    super.initialize(props);

    this.createButtons();
    this.setView(this._labelContainer.getView());
  }

  private createButtons() {
    this._labelContainer = new HeaderFormCell(this.androidContext());

    let buttonData = [];

    //Set the button stack's properties if "ExtensionProperties" is defined
    let extProps = this.definition().data.ExtensionProperties;
    if (extProps) {
      if (extProps.Title) {
        this.valueResolver().resolveValue(extProps.Title, this.context, true).then(value => {
          this._labelContainer.setTitle(value);
        })
      }
    }

    this._labelContainer.initNativeView();
  }

  // Override
  protected createObservable() {
    let extProps = this.definition().data.ExtensionProperties;
    //Pass ExtensionProperties.OnValueChange to BaseControl's OnValueChange
    if (extProps && extProps.OnValueChange) {
      this.definition().data.OnValueChange = extProps.OnValueChange;
    }
    return super.createObservable();
  }

  public setValue(value: any, notify: boolean, isTextValue?: boolean): Promise<any> {
    //Check the value
    if (value != null && value != undefined) {
      return this.observable().setValue(value, notify, isTextValue);
    } else {
      return Promise.reject("Error: Invalid value");
    }
  }

  public viewIsNative() {
    return true;
  }
}