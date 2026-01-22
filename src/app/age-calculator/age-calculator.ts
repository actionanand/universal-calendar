import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AgeBreakdown {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
}

@Component({
  selector: 'app-age-calculator',
  imports: [CommonModule],
  template: `
    <div class="age-calculator-container">
      <h1>Age Calculator</h1>
      <p class="subtitle">Calculate the exact age or time difference between two dates</p>

      <section class="calculator-section">
        <div class="date-inputs">
          <div class="input-group">
            <label for="startDate">
              <span class="label-text">From Date</span>
              <span class="label-hint">(Birth date or start date)</span>
            </label>
            <input
              id="startDate"
              type="date"
              [value]="startDate()"
              (input)="onStartDateChange($event)"
              [max]="maxStartDate()"
              class="date-input"
              required
            />
          </div>

          <div class="input-group">
            <label for="endDate">
              <span class="label-text">To Date</span>
              <span class="label-hint">(Leave empty for today)</span>
            </label>
            <input
              id="endDate"
              type="date"
              [value]="endDate()"
              (input)="onEndDateChange($event)"
              [min]="startDate()"
              [max]="todayString"
              class="date-input"
            />
            @if (endDate() !== todayString) {
              <button (click)="resetToToday()" class="reset-btn">Reset to Today</button>
            }
          </div>
        </div>

        @if (ageData()) {
          <div class="results-section">
            <div class="primary-result">
              <h2>Age</h2>
              <div class="age-display">
                <div class="age-part">
                  <span class="number">{{ ageData()!.years }}</span>
                  <span class="unit">{{ ageData()!.years === 1 ? 'Year' : 'Years' }}</span>
                </div>
                <div class="age-part">
                  <span class="number">{{ ageData()!.months }}</span>
                  <span class="unit">{{ ageData()!.months === 1 ? 'Month' : 'Months' }}</span>
                </div>
                <div class="age-part">
                  <span class="number">{{ ageData()!.days }}</span>
                  <span class="unit">{{ ageData()!.days === 1 ? 'Day' : 'Days' }}</span>
                </div>
              </div>
            </div>

            <div class="summary-section">
              <h3>Summary</h3>
              <p class="summary-text">
                From <strong>{{ formatDate(startDate()) }}</strong> to
                <strong>{{ formatDate(endDate()) }}</strong>
              </p>
            </div>

            <div class="breakdown-section">
              <h3>Detailed Breakdown</h3>
              <div class="breakdown-grid">
                <div class="breakdown-card">
                  <div class="breakdown-value">{{ formatNumber(ageData()!.totalMonths) }}</div>
                  <div class="breakdown-label">Total Months</div>
                </div>
                <div class="breakdown-card">
                  <div class="breakdown-value">{{ formatNumber(ageData()!.totalWeeks) }}</div>
                  <div class="breakdown-label">Total Weeks</div>
                </div>
                <div class="breakdown-card">
                  <div class="breakdown-value">{{ formatNumber(ageData()!.totalDays) }}</div>
                  <div class="breakdown-label">Total Days</div>
                </div>
                <div class="breakdown-card">
                  <div class="breakdown-value">{{ formatNumber(ageData()!.totalHours) }}</div>
                  <div class="breakdown-label">Total Hours</div>
                </div>
                <div class="breakdown-card">
                  <div class="breakdown-value">{{ formatNumber(ageData()!.totalMinutes) }}</div>
                  <div class="breakdown-label">Total Minutes</div>
                </div>
                <div class="breakdown-card">
                  <div class="breakdown-value">{{ formatNumber(ageData()!.totalSeconds) }}</div>
                  <div class="breakdown-label">Total Seconds</div>
                </div>
              </div>
            </div>

            <div class="milestones-section">
              <h3>Upcoming Milestones</h3>
              <div class="milestones-grid">
                @for (milestone of upcomingMilestones(); track milestone.name) {
                  <div class="milestone-card">
                    <div class="milestone-icon">🎉</div>
                    <div class="milestone-info">
                      <div class="milestone-name">{{ milestone.name }}</div>
                      <div class="milestone-date">{{ milestone.date }}</div>
                      <div class="milestone-countdown">{{ milestone.countdown }}</div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        } @else {
          <div class="no-data">
            <p>Select a start date to calculate age</p>
          </div>
        }
      </section>

      <section class="info-section">
        <h2>How to Use</h2>
        <div class="info-content">
          <div class="info-card">
            <h4>📅 Calculate Age</h4>
            <p>
              Enter your birth date in the "From Date" field to calculate your current age. The "To
              Date" automatically defaults to today.
            </p>
          </div>
          <div class="info-card">
            <h4>📊 Time Between Dates</h4>
            <p>
              Want to know the time between any two dates? Enter both dates to see the exact
              difference in years, months, and days.
            </p>
          </div>
          <div class="info-card">
            <h4>🎯 Detailed Breakdown</h4>
            <p>
              View the time difference in multiple formats: total months, weeks, days, hours,
              minutes, and even seconds!
            </p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: `
    .age-calculator-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      color: #1976d2;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      text-align: center;
    }

    .subtitle {
      text-align: center;
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }

    h2 {
      color: #333;
      font-size: 1.8rem;
      margin-bottom: 1rem;
    }

    h3 {
      color: #555;
      font-size: 1.3rem;
      margin-bottom: 1rem;
    }

    .calculator-section {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .date-inputs {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .input-group label {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .label-text {
      font-weight: 600;
      color: #333;
      font-size: 1.1rem;
    }

    .label-hint {
      font-size: 0.85rem;
      color: #888;
      font-style: italic;
    }

    .date-input {
      padding: 1rem;
      font-size: 1.1rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      transition: border-color 0.3s;
    }

    .date-input:focus {
      outline: none;
      border-color: #1976d2;
    }

    .reset-btn {
      padding: 0.5rem 1rem;
      background: #ff9800;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background 0.3s;
    }

    .reset-btn:hover {
      background: #f57c00;
    }

    .no-data {
      text-align: center;
      padding: 3rem;
      color: #999;
      font-size: 1.1rem;
    }

    .results-section {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .primary-result {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
    }

    .primary-result h2 {
      color: white;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
    }

    .age-display {
      display: flex;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .age-part {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .age-part .number {
      font-size: 3rem;
      font-weight: bold;
      line-height: 1;
    }

    .age-part .unit {
      font-size: 1.1rem;
      opacity: 0.9;
    }

    .summary-section {
      background: #f5f5f5;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
    }

    .summary-section h3 {
      margin-bottom: 0.75rem;
    }

    .summary-text {
      color: #555;
      font-size: 1.05rem;
      margin: 0;
    }

    .breakdown-section {
      background: #fafafa;
      padding: 2rem;
      border-radius: 8px;
    }

    .breakdown-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .breakdown-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
      transition:
        transform 0.2s,
        box-shadow 0.2s;
      overflow: hidden;
    }

    .breakdown-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }

    .breakdown-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #1976d2;
      margin-bottom: 0.5rem;
      word-break: break-word;
      overflow-wrap: break-word;
      line-height: 1.3;
    }

    .breakdown-label {
      color: #666;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      line-height: 1.2;
    }

    .milestones-section {
      background: #e3f2fd;
      padding: 2rem;
      border-radius: 8px;
    }

    .milestones-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .milestone-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      display: flex;
      gap: 1rem;
      align-items: center;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }

    .milestone-icon {
      font-size: 2rem;
    }

    .milestone-info {
      flex: 1;
    }

    .milestone-name {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.25rem;
    }

    .milestone-date {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }

    .milestone-countdown {
      color: #1976d2;
      font-size: 0.85rem;
      font-weight: 500;
    }

    .info-section {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .info-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .info-card {
      background: #f9f9f9;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #1976d2;
    }

    .info-card h4 {
      color: #1976d2;
      margin: 0 0 0.75rem 0;
      font-size: 1.1rem;
    }

    .info-card p {
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    @media (max-width: 768px) {
      .age-calculator-container {
        padding: 1rem;
      }

      h1 {
        font-size: 1.75rem;
      }

      h2 {
        font-size: 1.4rem;
      }

      h3 {
        font-size: 1.1rem;
      }

      .subtitle {
        font-size: 0.95rem;
      }

      .calculator-section,
      .info-section {
        padding: 1rem;
      }

      .date-inputs {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .primary-result {
        padding: 1.5rem;
      }

      .primary-result h2 {
        font-size: 1.2rem;
      }

      .age-display {
        gap: 1rem;
      }

      .age-part .number {
        font-size: 2rem;
      }

      .age-part .unit {
        font-size: 0.95rem;
      }

      .summary-section,
      .breakdown-section,
      .milestones-section {
        padding: 1rem;
      }

      .breakdown-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
      }

      .breakdown-card {
        padding: 1rem;
      }

      .breakdown-value {
        font-size: 1.3rem;
      }

      .breakdown-label {
        font-size: 0.75rem;
      }

      .milestones-grid {
        grid-template-columns: 1fr;
      }

      .milestone-card {
        padding: 1rem;
      }

      .info-content {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .info-card {
        padding: 1rem;
      }
    }
  `,
})
export class AgeCalculator {
  private readonly today = new Date();
  protected readonly todayString = this.formatDateToInput(this.today);

  protected readonly startDate = signal('');
  protected readonly endDate = signal(this.todayString);

  protected readonly maxStartDate = computed(() => this.endDate());

  protected readonly ageData = computed(() => {
    const start = this.startDate();
    const end = this.endDate();

    if (!start) {
      return null;
    }

    const startDateObj = new Date(start);
    const endDateObj = new Date(end);

    if (startDateObj > endDateObj) {
      return null;
    }

    return this.calculateAge(startDateObj, endDateObj);
  });

  protected readonly upcomingMilestones = computed(() => {
    const start = this.startDate();
    if (!start) {
      return [];
    }

    const startDateObj = new Date(start);
    const currentAge = this.ageData();
    if (!currentAge) {
      return [];
    }

    const milestones = [];
    const yearsToCheck = [
      currentAge.years + 1,
      Math.ceil((currentAge.years + 1) / 5) * 5,
      Math.ceil((currentAge.years + 1) / 10) * 10,
    ];

    const uniqueYears = [...new Set(yearsToCheck)].filter((y) => y > currentAge.years).slice(0, 3);

    for (const years of uniqueYears) {
      const milestoneDate = new Date(startDateObj);
      milestoneDate.setFullYear(startDateObj.getFullYear() + years);

      const daysUntil = Math.floor(
        (milestoneDate.getTime() - this.today.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysUntil >= 0) {
        milestones.push({
          name: `${years} Year${years !== 1 ? 's' : ''}`,
          date: this.formatDateLong(milestoneDate),
          countdown:
            daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`,
        });
      }
    }

    return milestones;
  });

  protected onStartDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.startDate.set(input.value);

    // If start date is after end date, reset end date to today
    if (input.value && input.value > this.endDate()) {
      this.endDate.set(this.todayString);
    }
  }

  protected onEndDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.endDate.set(input.value || this.todayString);
  }

  protected resetToToday(): void {
    this.endDate.set(this.todayString);
  }

  protected formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  protected formatDateLong(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  protected formatNumber(num: number): string {
    return num.toLocaleString('en-US');
  }

  private formatDateToInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private calculateAge(startDate: Date, endDate: Date): AgeBreakdown {
    // Calculate years, months, days
    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    let days = endDate.getDate() - startDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate totals
    const totalMonths = years * 12 + months;
    const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    return {
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
    };
  }
}
