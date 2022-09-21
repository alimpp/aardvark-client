import { VuexModule, Mutation, Action, Module } from 'vuex-module-decorators'
import DialogForm from '@/components/Form/Base/DialogForm.vue';

@Module({name:'dialogcs', namespaced: true})
export class DialogCS extends VuexModule implements IDialogCS {
    isShowingDialog = false;
    maxWidth: number | null = null;
    width: number | null = null;
    persistent = false;
    noHeader = false;
    noFooter = false;
    noClose = false;
    noConfirm = false;
    success = false;
    danger = false;
    dark = false;
    excludedClasses: string[] = [];
    fullsize = false;
    title = 'Header title';
    content: (typeof DialogForm) | null = null;
    confirmLabel = 'Confirm';
    cancelLabel = 'Cancel'
    disableConfirmButton = false;
    specificButton = false

    @Mutation
    setMaxWidth(maxWidth: number | null) {
        this.maxWidth = maxWidth;
    }

    @Mutation
    setWidth(width: number | null) {
        this.width = width;
    }

    @Mutation
    setPersistent(persistent: boolean) {
        this.persistent = persistent;
    }

    @Mutation
    setSpecificButton(specificButton: boolean) {
        this.specificButton = specificButton;
    }

    @Mutation
    setNoHeader(noHeader: boolean) {
        this.noHeader = noHeader;
    }

    @Mutation
    setNoFooter(noFooter: boolean) {
        this.noFooter = noFooter;
    }

    @Mutation
    setNoClose(noClose: boolean) {
        this.noClose = noClose;
    }

    @Mutation
    setNoConfirm(noConfirm: boolean) {
        this.noConfirm = noConfirm;
    }

    @Mutation
    setSuccess(success: boolean) {
        this.success = success;
    }

    @Mutation
    setDanger(danger: boolean) {
        this.danger = danger;
    }

    @Mutation
    setDark(dark: boolean) {
        this.dark = dark;
    }

    @Mutation
    setExcludedClasses(excludedClasses: string[]) {
        this.excludedClasses = excludedClasses;
    }

    @Mutation
    setFullsize(fullsize: boolean) {
        this.fullsize = fullsize;
    }

    @Mutation
    setTitle(title: string) {
        this.title = title;
    }

    @Mutation
    setContent(content: (typeof DialogForm) | null) {
        this.content = content;
    }

    @Mutation
    setConfirmLabel(label: string) {
        this.confirmLabel = label;
    }

    @Mutation
    setCancelLabel(label: string) {
        this.cancelLabel = label;
    }

    @Mutation
    setDisableConfirmButton(value: boolean) {
        this.disableConfirmButton = value;
    }

    @Mutation
    setIsShowingDialog(value: boolean) {
        this.isShowingDialog = value;
    }

    @Action({rawError: true})
    async load(options: IDialogCS) {
        this.setTitle(options.title);
        this.setContent(options.content);
        this.setIsShowingDialog(options.isShowingDialog);
        if(options.confirmLabel) this.setConfirmLabel(options.confirmLabel);
        if(options.cancelLabel) this.setCancelLabel(options.cancelLabel);
        if(options.maxWidth) this.setMaxWidth(options.maxWidth);
        if(options.width) this.setWidth(options.width);
        if(options.persistent) this.setPersistent(options.persistent);
        if(options.noHeader) this.setNoHeader(options.noHeader);
        if(options.noFooter) this.setNoFooter(options.noFooter);
        if(options.noClose) this.setNoClose(options.noClose);
        if(options.noConfirm) this.setNoConfirm(options.noConfirm);
        if(options.success) this.setSuccess(options.success);
        if(options.danger) this.setDanger(options.danger);
        if(options.dark) this.setDark(options.dark);
        if(options.excludedClasses) this.setExcludedClasses(options.excludedClasses);
        if (options.fullsize) this.setFullsize(options.fullsize);
        if (options.disableConfirmButton) this.setDisableConfirmButton(options.disableConfirmButton);
        if (options.specificButton) this.setSpecificButton(options.specificButton)

    }

    @Action({rawError: true})
    async clear() {
        this.setTitle('Header title');
        this.setContent(null);
        this.setIsShowingDialog(false);
        this.setConfirmLabel('Confirm');
        this.setConfirmLabel('Cancel');
        this.setMaxWidth(null);
        this.setWidth(null);
        this.setPersistent(false);
        this.setNoHeader(false);
        this.setNoFooter(false);
        this.setNoClose(false);
        this.setNoConfirm(false);
        this.setSuccess(false);
        this.setDanger(false);
        this.setDark(false);
        this.setExcludedClasses([]);
        this.setFullsize(false);
        this.setDisableConfirmButton(false);
        this.setSpecificButton(false)
    }

}
export interface IDialogCS {
    isShowingDialog: boolean
    title: string
    content: (typeof DialogForm) | null
    confirmLabel?: string
    cancelLabel?: string
    maxWidth?: number | null
    width?: number | null
    persistent?: boolean
    noHeader?: boolean
    noFooter?: boolean
    noClose?: boolean
    noConfirm?: boolean
    success?: boolean
    danger?: boolean
    dark?: boolean
    excludedClasses?: string[]
    fullsize?: boolean
    disableConfirmButton?: boolean
    specificButton?: boolean
}
