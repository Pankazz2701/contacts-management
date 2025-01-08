import { Component, OnInit } from '@angular/core';
import { Contact, ContactService } from '../../services/contact.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
  imports: [CommonModule, NgbModule],
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];

  constructor(private contactService: ContactService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactService.getContacts().subscribe((data) => {
      this.contacts = data;
    });
  }

  openContactForm(contactId?: number): void {
    const modalRef = this.modalService.open(ContactFormComponent, { size: 'lg' });
    modalRef.componentInstance.contactId = contactId;
    modalRef.componentInstance.onSave.subscribe(() => {
      this.loadContacts();
    });
  }

  deleteContact(id: number): void {
    if (confirm('Are you sure you want to delete this contact?')) {
      this.contactService.deleteContact(id).subscribe(() => {
        this.contacts = this.contacts.filter((contact) => contact.id !== id);
      });
    }
  }
}
