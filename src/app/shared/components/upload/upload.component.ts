import { BadRequestError } from './../../services/errors/bad-request-error';
import {
  Component,
  Input,
  HostListener,
  OnInit,
  OnDestroy,
  OnChanges,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { UploadService } from '../../services/upload/upload.service';
import {
  NG_VALUE_ACCESSOR,
  ControlContainer,
} from '@angular/forms';
import { EventEmitter, Output, Optional, SkipSelf } from '@angular/core';
import { map } from 'rxjs/operators';
import { Host } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: UploadComponent,
      multi: true,
    },
  ],
})
export class UploadComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @Input() formControlName!: string;
  @Input('id') id!: string;
  @Input('type') type = 'logo';
  @Input('maxSize') maxSize = 20000000;
  @Input('disableMode') disableMode = false;
  @Input('showMode') showMode = false;
  @Input('editMode') editMode = false;

  @Output('isMaxSize') isMaxSize = new EventEmitter<any>();
  @Output('inValidExtention') inValidExtention = new EventEmitter<any>();
  @Output('fileRemoved') fileRemoved = new EventEmitter<any>();
  @Output('fileUploaded') fileUploaded = new EventEmitter<any>();
  @Output('projectDisableMode') projectDisableMode = new EventEmitter<any>();

  @ViewChild('uploadSection') uploadSection!: ElementRef;
  onChange!: Function;
  public file: File | null = null;
  public fileName!: string;
  public imgView!: string | ArrayBuffer | null;

  protected grabage: Subscription = new Subscription();
  private started = false;
  public showTrash = false;

  private control: AbstractControl | null | undefined;

  constructor(
    private service: UploadService,
    @Optional()
    @Host()
    @SkipSelf()
    private controlContainer: ControlContainer,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    //  this.setImgView();

    if (this.controlContainer) {
      this.control = this.controlContainer.control?.get(this.formControlName);
    }
  }

  ngAfterViewInit() {
    if (this.control?.status === 'DISABLED') {
      this.setDisabledState();
    }
  }

  ngOnChanges() {
    this.setImgView();
  }

  setImgView() {
    if (this.id) {
      this.load();
    } else {
      this.setDefaultImage();
    }
  }

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const file = event && event.item(0);
    this.file = file;
    this.onImageAdded();
  }

  @HostListener('click', ['$event.target'])
  handlerInpuFile(event: any) {
    if (event.tagName === 'LABEL') {
      const fileInput = event.querySelector('input');

      if (this.type == 'attachment' && this.disableMode) {
        fileInput.setAttribute('disabled', true);
        this.projectDisableMode.emit(true);
      } else {
        fileInput.removeAttribute('disabled');
      }
    }
  }

  writeValue(value: '') {
    // clear file input
    this.id = value;
    this.file = null;

    if (this.id) {
      this.load();
    }
  }

  propagateChange = (_: any) => {};
  onTouch: any = () => {};

  registerOnChange(fn: any) {
    this.propagateChange = fn;
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  get percent() {
    return this.progress + '%';
  }

  get finished() {
    return this.progress === 100;
  }

  get progress():any {
    if (this.service.signalr.method === 'upload' && this.started) {
      return this.service.signalr.progress;
    }
  }

  onImageAdded() {
    if (this.file) {
      let reader = new FileReader();

      reader.readAsDataURL(this.file);
      reader.onload = (event: Event) => {
        if (reader) this.imgView = reader.result;
      };

      if (this.file.size > this.maxSize) {
        this.isMaxSize.emit(true);
        reader = <FileReader>{};
        this.setImgView();
        return;
      }

      // this.inValidExtention.emit(this.fileAllowExtention());

      this.started = true;
      this.grabage.add(
        this.service
          .uploadFile({ file: this.file })
          .pipe(
            map((res: any) => {
              if (res) {
                const data = res.result[0];
                return data;
              }
            })
          )
          .subscribe(
            (res: any) => {
              this.onChange(res.id);
              this.onTouch();
              this.id = res.id;
              this.started = false;
              this.showTrash = true;
              this.fileUploaded.emit(true);
            },
            (error: any) => {
              if (error instanceof BadRequestError) {

                this.control?.setErrors({ unhandled: true });
                this.onTouch();
              }
            }
          )
      );
    }
  }

  remove() {
    if (this.id) {
      if (!this.editMode) {
        this.grabage.add(
          this.service.removeFile(this.id).subscribe((data: any) => {
            if (data.status == 200) {
              this.postRemoveFile();
            }
          })
        );
      } else {
        this.postRemoveFile();
      }
    } else {
      this.id = '';
      this.showTrash = false;
      this.setImgView();
    }
  }

  postRemoveFile() {
    this.imgView = '';
    this.id = '';
    this.showTrash = false;
    this.setImgView();
    this.fileRemoved.emit(true);
  }

  load() {
    this.grabage.add(
      this.service.loadFile(this.id).subscribe((response: any) => {
        const result = response[0];
        if (result.Type && result.FileByte) {
          this.imgView = `data:${result.Type};base64,${result.FileByte}`;
          if (!this.showMode) {
            this.showTrash = true;
          }
        } else {
          this.id = '';
          this.propagateChange(this.id);
          this.setDefaultImage();
        }
      })
    );
  }

  download() {
    if (this.showMode && this.id) {
      this.service.downloadFile(this.id);
    }
    //  this.service.downloadAttachment('123323366', 'supplierAttachment');
  }

  fileAllowExtention() {
    const extentionSet = [
      'txt',
      'pdf',
      'doc',
      'docx',
      'xls',
      'xlsx',
      'png',
      'gif',
      'jpg',
      'jpeg',
      'tiff',
      'svg',
      'gif',
      'csv',
    ];
    const ext = this.file?.name
      .substring(this.file.name.lastIndexOf('.') + 1)
      .toLowerCase();

    if (this.file instanceof File && !extentionSet.includes(ext || '')) {
      return { extention: true };
    }
    return null;
  }

  setDefaultImage() {
    if (this.type === 'logo') {
      this.imgView = '/assets/svg/uploadPic.svg';
    } else if (this.type === 'attachment') {
      this.imgView = '/assets/svg/uploadDoc.svg';
    }
  }

  setDisabledState() {
    const uploads = document.querySelectorAll('.upload-section');

    uploads.forEach((el: any) => {
      el.style.opacity = '0.4';
      el.style.pointerEvents = 'none';
    });
    /*     if (this.uploadSection) {
      this.renderer.setStyle(
        this.uploadSection.nativeElement,
        'pointer-events',
        'none'
      );
      this.renderer.setStyle(
        this.uploadSection.nativeElement,
        'opacity',
        '0.4'
      );
    } */
  }

  ngOnDestroy() {
    this.grabage.unsubscribe();
  }
}
