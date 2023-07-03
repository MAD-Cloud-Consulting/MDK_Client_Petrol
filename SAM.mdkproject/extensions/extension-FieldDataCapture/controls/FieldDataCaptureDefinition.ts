import { BaseControlDefinition } from 'mdk-core/definitions/controls/BaseControlDefinition';
import { NoteFormCellDefinition } from 'mdk-core/definitions/controls/NoteFormCellDefinition';
import { ErrorMessage } from 'mdk-core/errorHandling/ErrorMessage';
import { ExtensionFormCellDefinition } from 'mdk-core/definitions/controls/ExtensionFormCellDefinition';

export class FieldDataCaptureDefinition extends BaseControlDefinition {
    protected controlDefs: BaseControlDefinition[] = [];
    protected controlNamesWithSuffixes: string[] = [];
    protected controlNamesWithoutSuffixes: string[] = [];
    protected _sectionCount: number;
    protected _numberOfRowsInSection: number[];
    protected _sectionNames: string[];
    protected _entityCounts: number[] = [];

    constructor(path, data, parent) {
        super(path, data, parent);

        this.loadControlDefs();
    }

    get sections(): any[] {
        return this.data.Sections;
    }

    public get sectionCount(): number {
        return this._sectionCount;
    }

    public get sectionNames(): string[] {
        return this._sectionNames;
    }

    public get numberOfRowsInSection(): number[] {
        return this._numberOfRowsInSection;
    }

    public getControlDefs(): BaseControlDefinition[] {
        return this.controlDefs;
    }

    public getControlNamesWithoutSuffixes(): string[] {
        return this.controlNamesWithoutSuffixes;
    }

    public getControlNamesWithSuffixes(): string[] {
        return this.controlNamesWithSuffixes;
    }

    public indexPath(name: string): { row: number, section: number } {
        let row: number = -1;
        let section: number = -1;
        let controlIndex = this.controlNamesWithSuffixes.indexOf(name);
        if (controlIndex !== -1) {
            for (let rowsInSection of this.numberOfRowsInSection) {
                section++;
                if (controlIndex >= rowsInSection) {
                    controlIndex = controlIndex - rowsInSection;
                } else {
                    if (controlIndex !== -1) {
                        row = controlIndex;
                        break;
                    }
                }
            }
            return { row, section };
        }
    }

    // Take all of the defined form cells and stuff them into the appropriate BaseControlDefinition
    // subclass.
    // TODO: Consider making FormCellContainerDefinition a child of ContainerDefinition and leverage
    // the existing _loadControls method in ContainerDefinition.
    protected loadControlDefs() {
        let controlDefs = [];
        let controlsNamesWithoutSuffixes = [];
        let controlsNamesWithSuffixes = [];
        let sectionCount = 0;
        let sectionNames = [];
        let numberOfRowsInSection = [];

        for (let sectionIndex = 0; sectionIndex < this.data.Sections.length; sectionIndex++) {
            let section = this.data.Sections[sectionIndex];
            let entityCount = this._entityCounts[sectionIndex] ? this._entityCounts[sectionIndex] : 1;
            for (let entityIndex = 0; entityIndex < entityCount; entityIndex++) {
                let nameSuffix = '_' + sectionIndex + '_' + entityIndex;
                sectionCount++;
                sectionNames.push(section.Caption ? section.Caption : '');
                numberOfRowsInSection.push(section.Controls.length);

                let controls = section.Controls.map((controlData) => {
                    let controlName: String = controlData._Name + nameSuffix;
                    let copyControlData = Object.assign({}, controlData);
                    copyControlData._Name = controlName;
                    return this.generateControl(copyControlData);
                });

                let controlNamesWithoutSuffixes = section.Controls.map((controlData) => {
                    return controlData._Name;
                });

                let controlNamesWithSuffixes = section.Controls.map((controlData) => {
                    return controlData._Name + nameSuffix;
                });

                controlDefs.push(...controls);
                controlsNamesWithoutSuffixes.push(...controlNamesWithoutSuffixes);
                controlsNamesWithSuffixes.push(...controlNamesWithSuffixes);
            }
        }
        this.controlDefs = controlDefs;
        this.controlNamesWithoutSuffixes = controlsNamesWithoutSuffixes;
        this.controlNamesWithSuffixes = controlsNamesWithSuffixes;

        this._sectionCount = sectionCount;
        this._sectionNames = sectionNames;
        this._numberOfRowsInSection = numberOfRowsInSection;
    }

    protected generateControl(controlData): BaseControlDefinition {
        switch (controlData._Type) {
            case BaseControlDefinition.type.FormCellDurationPicker:
            case BaseControlDefinition.type.FormCellDatePicker:
            case BaseControlDefinition.type.FormCellNote:
            case BaseControlDefinition.type.FormCellSimpleProperty:
            case BaseControlDefinition.type.FormCellSwitch:
            case BaseControlDefinition.type.FormCellTitle:
            case BaseControlDefinition.type.FormCellSegmentedControl:
            case BaseControlDefinition.type.FormCellListPicker:
            case BaseControlDefinition.type.FormCellFilter:
            case BaseControlDefinition.type.FormCellSorter:
            case BaseControlDefinition.type.FormCellAttachment:
            case BaseControlDefinition.type.FormCellButton:
                return new BaseControlDefinition('', controlData, this);
            case BaseControlDefinition.type.FormCellNote:
                return new NoteFormCellDefinition('', controlData, this);
            case BaseControlDefinition.type.FormCellExtension:
                return new ExtensionFormCellDefinition('', controlData, this);
            default:
                let sMessage = ErrorMessage.format(
                    ErrorMessage.INVALID_CALL_FORMCELLCONTAINERDEFINITION_AS_INVALID_TYPE, controlData._Type);
                throw new Error(sMessage);
        }
    }

    public set entityCounts(counts: number[]) {
        this._entityCounts = counts;
        this.loadControlDefs();
    }

    public get entityCounts(): number[] {
        return this._entityCounts;
    }
}
