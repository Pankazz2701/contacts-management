import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Contact, ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ContactFormComponent implements OnInit {
  @Input() contactId?: number;
  @Output() onSave = new EventEmitter<void>();
  contactForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.formValidation();
    if (this.contactId) {
      this.contactService.getContact(this.contactId).subscribe((contact) => {
        this.contactForm.patchValue(contact);
      });
    }
  }

  private formValidation(): void {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  saveContact(): void {
    if (this.contactForm?.valid) {
      const contact: Contact = this.contactForm.value;
      if (this.contactId) {
        contact.id = this.contactId;
        this.contactService.updateContact(contact).subscribe(() => {
          this.onSave.emit();
          this.activeModal.close();
        });
      } else {
        this.contactService.createContact(contact).subscribe(() => {
          this.onSave.emit();
          this.activeModal.close();
        });
      }
    }
  }

  cancel(): void {
    this.activeModal.dismiss('cancel');
  }
}
