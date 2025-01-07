import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Contact, ContactService } from '../../services/contact.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class ContactFormComponent implements OnInit {
  contactForm!: FormGroup;
  contactId?: number;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.formValidation();
    this.contactId = +this.route.snapshot.paramMap.get('id')!;
    if (this.contactId) {
      this.contactService.getContact(this.contactId).subscribe((contact) => {
        this.contactForm?.patchValue(contact);
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
          this.router.navigate(['/']);
        });
      } else {
        this.contactService.createContact(contact).subscribe(() => {
          this.router.navigate(['/']);
        });
      }
    }
  }
}
