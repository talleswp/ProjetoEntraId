import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { MsalAuthService } from '../../../core/services/msal.service';
import { AccountInfo } from '@azure/msal-browser';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MenubarModule, ButtonModule, AvatarModule, BadgeModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private readonly msalAuthService = inject(MsalAuthService);
  private readonly router = inject(Router);

  currentUser = signal<AccountInfo | null>(null);

  ngOnInit(): void {
    this.msalAuthService.currentUser$.subscribe(user => {
      this.currentUser.set(user);
    });
  }

  logout(): void {
    this.msalAuthService.logout();
  }

  navigateHome(): void {
    this.router.navigate(['/dashboard']);
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  getUserColor(name: string): string {
    const colors = [
      '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
      '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
    ];
    const index = name.length % colors.length;
    return colors[index];
  }
}