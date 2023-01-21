import { Component, AfterViewInit, Input, ElementRef, ViewChild, OnDestroy, Output, EventEmitter } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

declare var toastr: any;

@Component({
    selector: "file-drop",
    templateUrl: "./file-drop.component.html",
    styleUrls: ["./file-drop.component.css"],
})
export class FileDropComponent implements AfterViewInit, OnDestroy {
    @ViewChild('dropZoneRef') dropZoneRef: ElementRef;

    @Output() onFile = new EventEmitter();
    
    @Input() label: string = "";
    @Input() multiple: boolean = false;
    @Input() fileTypes: Array<string> = ['application/pdf'];
    @Input() wrongFileTypeMessage: string = "";
    @Input() canSeeFile: boolean = false;

    isDragging: boolean = false;
    file: BehaviorSubject<File | null> = new BehaviorSubject(null);
    dragCount: number = 0;

    constructor(private el: ElementRef) { }

    ngAfterViewInit(): void {
        if (this.dropZoneRef) {
            const target = this.dropZoneRef.nativeElement;
            target.addEventListener('dragenter', e => this.handleDragIn(e));
            target.addEventListener('dragleave', e => this.handleDragOut(e));
            target.addEventListener('dragover', e => this.handleDrag(e));
            target.addEventListener('drop', e => this.handleDrop(e));
        }

        this.file.subscribe({
            next: value => {
                this.onFile.emit(value);
            }
        })
    }

    ngOnDestroy(): void {
        if (this.dropZoneRef) {
            const target = this.dropZoneRef.nativeElement;
            target.removeEventListener('dragenter', e => this.handleDragIn(e))
            target.removeEventListener('dragleave', e => this.handleDragOut(e))
            target.removeEventListener('dragover', e => this.handleDrag(e));
            target.removeEventListener('drop', e => this.handleDrop(e));
        }
    }

    handleDragIn(e) {
        e.preventDefault();
        e.stopPropagation();
        this.dragCount = this.dragCount + 1;
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            this.isDragging = true;
        }
    }

    handleDragOut(e) {
        e.preventDefault();
        e.stopPropagation();
        this.dragCount = this.dragCount - 1;
        if (this.dragCount > 0) return
        this.isDragging = false;
    }

    handleDrag(e) {
        e.preventDefault();
        e.stopPropagation();
        this.isDragging = true;
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const f = e.dataTransfer.files[0];
            this.dragCount = 0;
            this.isDragging = false;
            e.dataTransfer.clearData();
            this.setFileIfHasType(f);
        }
    }

    deleteAttachment() {
        this.file.next(null);
        this.isDragging = false;
        this.dragCount = 0;
    }

    setFileIfHasType(file) {
        if (!this.fileTypes.find(t => file.type === t)) {
            toastr.error(this.wrongFileTypeMessage?.length ? this.wrongFileTypeMessage : 'Tipo de arquivo não permitido');
            return
        }
        this.file.next(file);
    }

    showFile() {
        window.open(URL.createObjectURL(this.file.getValue()), '_blank');
    }

    onChange(e: Event) {
        console.log(e);
        const target = e.target as HTMLInputElement;
        const files = target.files as FileList;
        if (files.length) {
            console.log('tipo', files[0].type);
            this.setFileIfHasType(files[0]);
        }
    }
}
