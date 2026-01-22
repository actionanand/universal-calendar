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

    @media (max-width: 768px) {
      .nav-container {
        flex-direction: column;
        padding: 0.75rem 1rem;
        gap: 0.75rem;
        align-items: stretch;
      }

      .nav-title {
        font-size: 1.1rem;
        text-align: center;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      }

      .nav-links {
        flex-direction: row;
        gap: 0.25rem;
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;
        padding-bottom: 0.25rem;
      }

      .nav-links::-webkit-scrollbar {
        height: 3px;
      }

      .nav-links::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 3px;
      }

      .nav-links li {
        flex-shrink: 0;
      }

      .nav-links a {
        text-align: center;
        padding: 0.5rem 0.75rem;
        font-size: 0.85rem;
        white-space: nowrap;
        display: block;
      }
    }
  `,
})
export class NavBar {}
