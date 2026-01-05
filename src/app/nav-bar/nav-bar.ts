import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="nav-bar">
      <div class="nav-container">
        <h1 class="nav-title">Universal Calendar</h1>
        <ul class="nav-links">
          <li>
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
              Angular Updates
            </a>
          </li>
          <li>
            <a routerLink="/calendar" routerLinkActive="active"> Calendar </a>
          </li>
          <li>
            <a routerLink="/perpetual-calendar" routerLinkActive="active"> Perpetual Calendar </a>
          </li>
          <li>
            <a routerLink="/age-calculator" routerLinkActive="active"> Age Calculator </a>
          </li>
        </ul>
      </div>
    </nav>
  `,
  styles: `
    .nav-bar {
      background-color: #1976d2;
      color: white;
      padding: 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
    }

    .nav-links {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 2rem;
    }

    .nav-links li {
      margin: 0;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .nav-links a:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .nav-links a.active {
      background-color: rgba(255, 255, 255, 0.2);
      font-weight: 500;
    }
  `,
})
export class NavBar {}
