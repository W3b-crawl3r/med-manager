import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {

  // ====== DATA ======
  doctors: any[] = [];
  filteredDoctors: any[] = [];

  specialties: string[] = ['Cardiologie', 'Dermatologie', 'Pédiatrie', 'Gynécologie'];

  searchTerm = '';
  selectedSpecialty = 'all';
  selectedStatus = 'all';

  viewMode: 'list' | 'grid' = 'list';

  // ====== STATS ======
  totalDoctors = 0;
  activeDoctors = 0;
  totalPatients = 0;
  specialtiesCount = 0;

  // ====== SELECTION ======
  selectedDoctors: number[] = [];

  // ====== PAGINATION ======
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  // ====== SORT ======
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // ====== MODALS ======
  showModal = false;
  showDetailsModal = false;
  isEditing = false;
  selectedDoctor: any = null;

  doctorForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.loadDoctors();
  }

  // ====== INIT ======
  initForm() {
    this.doctorForm = this.fb.group({
      name: ['', Validators.required],
      specialty: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      licenseNumber: [''],
      status: ['active'],
      notes: ['']
    });
  }

  loadDoctors() {
    // Fake data (temporaire)
    this.doctors = [
      {
        id: 1,
        name: 'Dr Ahmed Benali',
        specialty: 'Cardiologie',
        email: 'ahmed@med.com',
        phone: '0612345678',
        status: 'active',
        patients: 120,
        patientGrowth: 5
      }
    ];

    this.applyFilters();
  }

  // ====== FILTER / SEARCH ======
  filterDoctors() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredDoctors = this.doctors.filter(d => {
      return (
        (this.searchTerm === '' || d.name.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
        (this.selectedSpecialty === 'all' || d.specialty === this.selectedSpecialty) &&
        (this.selectedStatus === 'all' || d.status === this.selectedStatus)
      );
    });

    this.totalDoctors = this.filteredDoctors.length;
    this.activeDoctors = this.filteredDoctors.filter(d => d.status === 'active').length;
    this.totalItems = this.filteredDoctors.length;
    this.specialtiesCount = this.specialties.length;
  }

  // ====== VIEW ======
  setViewMode(mode: 'list' | 'grid') {
    this.viewMode = mode;
  }

  // ====== SORT ======
  sortDoctors(column: string) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortColumn = column;
  }

  // ====== SELECTION ======
  toggleDoctorSelection(id: number) {
    if (this.selectedDoctors.includes(id)) {
      this.selectedDoctors = this.selectedDoctors.filter(i => i !== id);
    } else {
      this.selectedDoctors.push(id);
    }
  }

  toggleSelectAll(event: any) {
    this.selectedDoctors = event.target.checked ? this.filteredDoctors.map(d => d.id) : [];
  }

  deleteSelected() {
    this.doctors = this.doctors.filter(d => !this.selectedDoctors.includes(d.id));
    this.selectedDoctors = [];
    this.applyFilters();
  }

  // ====== MODALS ======
  openAddDoctorModal() {
    this.isEditing = false;
    this.doctorForm.reset({ status: 'active' });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveDoctor() {
    if (this.doctorForm.invalid) return;

    if (this.isEditing) {
      Object.assign(this.selectedDoctor, this.doctorForm.value);
    } else {
      this.doctors.push({
        id: Date.now(),
        patients: 0,
        patientGrowth: 0,
        ...this.doctorForm.value
      });
    }

    this.closeModal();
    this.applyFilters();
  }

  editDoctor(doctor: any) {
    this.isEditing = true;
    this.selectedDoctor = doctor;
    this.doctorForm.patchValue(doctor);
    this.showModal = true;
  }

  deleteDoctor(doctor: any) {
    this.doctors = this.doctors.filter(d => d.id !== doctor.id);
    this.applyFilters();
  }

  viewDoctorDetails(doctor: any) {
    this.selectedDoctor = doctor;
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
  }

  // ====== UTILS ======
  getStatusText(status: string) {
    return status === 'active' ? 'Actif' : status === 'inactive' ? 'Inactif' : 'En attente';
  }

  getSpecialtyColor(_: string) {
    return '#6c5ce7';
  }

  // Fonction manquante pour la pagination (corrige l'erreur TS2339)
  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  exportDoctors() {
    console.log('Export doctors');
  }

  previousPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    this.currentPage++;
  }

  updatePagination() { }

  sendReminder(_: any) { }

}
