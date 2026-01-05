import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarDay {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
}

interface MonthData {
  name: string;
  days: CalendarDay[];
}

@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  template: `
    <div class="calendar-container">
      <div class="calendar-header">
        <h1>Universal Calendar</h1>
        <div class="year-selector">
          <button (click)="previousYear()" class="year-nav-btn" aria-label="Previous year">
            ◀
          </button>
          <input
            type="number"
            [value]="selectedYear()"
            (input)="onYearInput($event)"
            min="1"
            max="9999"
            class="year-input"
            aria-label="Select year"
          />
          <button (click)="nextYear()" class="year-nav-btn" aria-label="Next year">▶</button>
          <button (click)="goToCurrentYear()" class="today-btn">Today</button>
        </div>
      </div>

      <div class="months-grid">
        @for (month of months(); track month.name) {
          <div class="month-card">
            <h2 class="month-name">{{ month.name }}</h2>
            <div class="calendar-grid">
              <div class="day-header">Sun</div>
              <div class="day-header">Mon</div>
              <div class="day-header">Tue</div>
              <div class="day-header">Wed</div>
              <div class="day-header">Thu</div>
              <div class="day-header">Fri</div>
              <div class="day-header">Sat</div>

              @for (day of month.days; track day.date + '-' + day.month) {
                <div
                  class="day-cell"
                  [class.other-month]="!day.isCurrentMonth"
                  [class.today]="isToday(day)"
                >
                  {{ day.date }}
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .calendar-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    .calendar-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .calendar-header h1 {
      color: #1976d2;
      margin-bottom: 1rem;
    }

    .year-selector {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    .year-input {
      font-size: 1.5rem;
      padding: 0.5rem 1rem;
      border: 2px solid #1976d2;
      border-radius: 4px;
      text-align: center;
      width: 120px;
      font-weight: bold;
    }

    .year-nav-btn {
      background-color: #1976d2;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      font-size: 1.2rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .year-nav-btn:hover {
      background-color: #1565c0;
    }

    .year-nav-btn:active {
      transform: scale(0.95);
    }

    .today-btn {
      background-color: #4caf50;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s;
    }

    .today-btn:hover {
      background-color: #45a049;
    }

    .months-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .month-card {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .month-name {
      text-align: center;
      color: #1976d2;
      font-size: 1.3rem;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e0e0e0;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
    }

    .day-header {
      text-align: center;
      font-weight: bold;
      color: #666;
      padding: 0.5rem;
      font-size: 0.85rem;
    }

    .day-cell {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem;
      border: 1px solid #f0f0f0;
      background-color: white;
      font-size: 0.9rem;
    }

    .day-cell.other-month {
      color: #ccc;
      background-color: #fafafa;
    }

    .day-cell.today {
      background-color: #1976d2;
      color: white;
      font-weight: bold;
      border-radius: 50%;
    }

    @media (max-width: 768px) {
      .calendar-container {
        padding: 1rem;
      }

      .months-grid {
        grid-template-columns: 1fr;
      }

      .year-selector {
        flex-wrap: wrap;
      }
    }
  `,
})
export class Calendar {
  private readonly currentDate = new Date();
  protected readonly selectedYear = signal(this.currentDate.getFullYear());

  protected readonly months = computed(() => this.generateYear(this.selectedYear()));

  private readonly monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  protected previousYear(): void {
    this.selectedYear.update((year) => Math.max(1, year - 1));
  }

  protected nextYear(): void {
    this.selectedYear.update((year) => Math.min(9999, year + 1));
  }

  protected goToCurrentYear(): void {
    this.selectedYear.set(this.currentDate.getFullYear());
  }

  protected onYearInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const year = parseInt(input.value, 10);
    if (!isNaN(year) && year >= 1 && year <= 9999) {
      this.selectedYear.set(year);
    }
  }

  protected isToday(day: CalendarDay): boolean {
    return (
      day.date === this.currentDate.getDate() &&
      day.month === this.currentDate.getMonth() &&
      day.year === this.currentDate.getFullYear()
    );
  }

  private generateYear(year: number): MonthData[] {
    return this.monthNames.map((name, monthIndex) => ({
      name,
      days: this.generateMonth(year, monthIndex),
    }));
  }

  private generateMonth(year: number, month: number): CalendarDay[] {
    const days: CalendarDay[] = [];

    // First day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();

    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Previous month's trailing days
    const prevMonthLastDay = new Date(year, month, 0);
    const daysInPrevMonth = prevMonthLastDay.getDate();

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      days.push({
        date: daysInPrevMonth - i,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
      });
    }

    // Current month's days
    for (let date = 1; date <= daysInMonth; date++) {
      days.push({
        date,
        month,
        year,
        isCurrentMonth: true,
      });
    }

    // Next month's leading days
    const remainingCells = 42 - days.length; // 6 rows × 7 days
    for (let date = 1; date <= remainingCells; date++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      days.push({
        date,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
      });
    }

    return days;
  }
}
