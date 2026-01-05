import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-angular-updates',
  imports: [CommonModule],
  template: `
    <div class="updates-container">
      <h1>Angular Recent Changes</h1>
      <p class="intro">Explore the latest features and improvements in Angular 20 and 21</p>

      <section class="version-section">
        <h2>Angular 21 (November 2024)</h2>
        <div class="features">
          <div class="feature-card">
            <h3>🚀 Incremental Hydration</h3>
            <p>
              Fine-grained control over when and how components are hydrated on the client side,
              improving performance for server-side rendered applications.
            </p>
          </div>

          <div class="feature-card">
            <h3>⚡ Event Replay</h3>
            <p>
              Events that occur before hydration are now captured and replayed, ensuring no user
              interactions are lost during the initial page load.
            </p>
          </div>

          <div class="feature-card">
            <h3>🎯 Improved Signals</h3>
            <p>
              Enhanced signal APIs with better TypeScript inference and new utilities for working
              with async data.
            </p>
          </div>

          <div class="feature-card">
            <h3>🔧 Enhanced Developer Experience</h3>
            <p>
              Better error messages, improved debugging tools, and faster build times with optimized
              compilation.
            </p>
          </div>

          <div class="feature-card">
            <h3>📦 Standalone by Default</h3>
            <p>
              All new projects and schematics now use standalone components as the default,
              simplifying module management.
            </p>
          </div>
        </div>
      </section>

      <section class="version-section">
        <h2>Angular 20 (May 2024)</h2>
        <div class="features">
          <div class="feature-card">
            <h3>🎨 Material 3 Support</h3>
            <p>
              Full integration with Material Design 3, bringing modern design patterns and enhanced
              theming capabilities.
            </p>
          </div>

          <div class="feature-card">
            <h3>🔄 Zoneless Change Detection</h3>
            <p>
              Experimental support for running Angular without Zone.js, improving performance and
              reducing bundle size.
            </p>
          </div>

          <div class="feature-card">
            <h3>📱 Enhanced SSR</h3>
            <p>
              Improved server-side rendering with better hydration strategies and automatic transfer
              state management.
            </p>
          </div>

          <div class="feature-card">
            <h3>🎭 View Transitions API</h3>
            <p>
              Built-in support for the View Transitions API, enabling smooth animations between
              route changes.
            </p>
          </div>

          <div class="feature-card">
            <h3>⚙️ Signals Inputs/Outputs</h3>
            <p>
              Component inputs and outputs can now use signals, providing better reactivity and type
              safety.
            </p>
          </div>

          <div class="feature-card">
            <h3>🏗️ Improved Build System</h3>
            <p>
              Faster builds with esbuild and vite integration, significantly reducing development
              and production build times.
            </p>
          </div>
        </div>
      </section>

      <section class="highlights">
        <h2>Key Highlights Across Both Versions</h2>
        <ul>
          <li>
            <strong>Performance:</strong> Significant improvements in runtime performance and bundle
            size optimization
          </li>
          <li>
            <strong>Developer Experience:</strong> Better tooling, faster builds, and improved error
            messages
          </li>
          <li>
            <strong>Modern Standards:</strong> Alignment with web standards and modern JavaScript
            features
          </li>
          <li>
            <strong>Signals:</strong> Continued investment in signals as the future of reactivity in
            Angular
          </li>
          <li>
            <strong>Standalone APIs:</strong> Simplified application architecture without NgModules
          </li>
        </ul>
      </section>
    </div>
  `,
  styles: `
    .updates-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      color: #1976d2;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .intro {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 2rem;
    }

    .version-section {
      margin-bottom: 3rem;
    }

    h2 {
      color: #333;
      font-size: 2rem;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 3px solid #1976d2;
    }

    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .feature-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      transition:
        transform 0.2s,
        box-shadow 0.2s;
    }

    .feature-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .feature-card h3 {
      color: #1976d2;
      font-size: 1.3rem;
      margin-bottom: 0.75rem;
    }

    .feature-card p {
      color: #555;
      line-height: 1.6;
    }

    .highlights {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 2rem;
      margin-top: 2rem;
    }

    .highlights h2 {
      border-bottom-color: #ff6b6b;
    }

    .highlights ul {
      list-style: none;
      padding: 0;
    }

    .highlights li {
      padding: 0.75rem 0;
      border-bottom: 1px solid #e0e0e0;
      line-height: 1.6;
    }

    .highlights li:last-child {
      border-bottom: none;
    }

    .highlights strong {
      color: #1976d2;
    }

    @media (max-width: 768px) {
      .updates-container {
        padding: 1rem;
      }

      h1 {
        font-size: 2rem;
      }

      h2 {
        font-size: 1.5rem;
      }

      .features {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class AngularUpdates {}
