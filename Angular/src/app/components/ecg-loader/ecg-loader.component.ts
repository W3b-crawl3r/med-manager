import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-ecg-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ecg-loader.component.html',
  styleUrls: ['./ecg-loader.component.css']
})
export class EcgLoaderComponent implements OnInit, OnDestroy {
  loading = false;
  private routerSubscription?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events
      .pipe(
        filter((event: Event): event is NavigationStart | NavigationEnd | NavigationCancel | NavigationError => 
          event instanceof NavigationStart || 
          event instanceof NavigationEnd || 
          event instanceof NavigationCancel || 
          event instanceof NavigationError
        )
      )
      .subscribe((event: NavigationStart | NavigationEnd | NavigationCancel | NavigationError) => {
        if (event instanceof NavigationStart) {
          this.loading = true;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          // Add a delay for smooth transition and to see the ECG animation
          setTimeout(() => {
            this.loading = false;
          }, 800);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}

