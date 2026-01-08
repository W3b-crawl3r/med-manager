import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  ngOnInit() {
    this.setupTabNavigation();
  }

  setupTabNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.settings-section');
    
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Retirer la classe active de tous les éléments
        navItems.forEach(nav => nav.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        
        // Ajouter la classe active à l'élément cliqué
        item.classList.add('active');
        
        // Afficher la section correspondante
        const tab = item.getAttribute('data-tab');
        const targetSection = document.getElementById(`${tab}-tab`);
        if (targetSection) {
          targetSection.classList.add('active');
        }
      });
    });
  }
}