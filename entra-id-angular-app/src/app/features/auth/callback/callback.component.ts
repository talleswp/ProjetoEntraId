import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  template: `
    <div class="callback-container">
      <div class="text-center">
        <p-progressSpinner 
          styleClass="w-6rem h-6rem" 
          strokeWidth="6"
          fill="transparent"
          animationDuration=".5s"
        ></p-progressSpinner>
        <h3 class="mt-4 text-900">Processando login...</h3>
        <p class="text-600">Aguarde enquanto validamos suas credenciais.</p>
      </div>
    </div>
  `,
  styles: [`
    .callback-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: var(--surface-ground);
    }
  `]
})
export class CallbackComponent implements OnInit {
  private readonly router = inject(Router);

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 2000);
  }
}