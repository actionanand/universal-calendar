/* eslint-disable @typescript-eslint/array-type */
import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface YearInfo {
  year: number;
  isLeapYear: boolean;
  startDay: number; // 0 = Sunday, 1 = Monday, etc.
  category: string;
}

interface CalendarDay {
  date: number;
  month: number;
  year: number;
  dayOfWeek: number;
  isCurrentMonth: boolean;
}

@Component({
  selector: 'app-perpetual-calendar',
  imports: [CommonModule],
  template: `
    <div class="perpetual-container">
      <h1>Perpetual Calendar Lookup</h1>

      <section class="date-finder">
        <h2>🗓️ Find Day for Any Date</h2>
        <div class="date-finder-content">
          <div class="date-input-group">
            <div class="input-field">
              <label for="dateInput">Select Date:</label>
              <input
                id="dateInput"
                type="date"
                [value]="selectedDate()"
                (input)="onDateChange($event)"
                min="1900-01-01"
                max="2100-12-31"
                class="date-input"
              />
            </div>
            <div class="or-divider">OR</div>
            <div class="manual-inputs">
              <div class="input-field">
                <label for="monthSelect">Month:</label>
                <select
                  id="monthSelect"
                  [value]="selectedMonth()"
                  (change)="onMonthChange($event)"
                  class="month-select"
                >
                  @for (month of monthNames; track month; let i = $index) {
                    <option [value]="i">{{ month }}</option>
                  }
                </select>
              </div>
              <div class="input-field">
                <label for="daySelect">Day:</label>
                <input
                  id="daySelect"
                  type="number"
                  [value]="selectedDay()"
                  (input)="onDayChange($event)"
                  [min]="1"
                  [max]="maxDaysInSelectedMonth()"
                  class="day-input"
                />
              </div>
              <div class="input-field">
                <label for="yearSelect">Year:</label>
                <input
                  id="yearSelect"
                  type="number"
                  [value]="selectedDateYear()"
                  (input)="onDateYearChange($event)"
                  min="1900"
                  max="2100"
                  class="year-input"
                />
              </div>
            </div>
          </div>

          @if (selectedDateInfo()) {
            <div class="date-result">
              <div class="result-header">
                <h3>{{ formatDate(selectedDateInfo()!) }}</h3>
                <div class="day-badge">{{ getDayName(selectedDateInfo()!.dayOfWeek) }}</div>
              </div>
              <p class="result-details">
                This date falls on a
                <strong>{{ getDayName(selectedDateInfo()!.dayOfWeek) }}</strong>
              </p>
            </div>
          }
        </div>
      </section>

      <section class="month-calendar-view">
        <h2>📆 Month View</h2>
        @if (monthCalendar()) {
          <div class="month-view-container">
            <h3 class="month-title">
              {{ getFullMonthName(selectedMonth()) }} {{ selectedDateYear() }}
            </h3>
            <div class="calendar-grid">
              <div class="day-header">Sun</div>
              <div class="day-header">Mon</div>
              <div class="day-header">Tue</div>
              <div class="day-header">Wed</div>
              <div class="day-header">Thu</div>
              <div class="day-header">Fri</div>
              <div class="day-header">Sat</div>

              @for (day of monthCalendar(); track day.date + '-' + day.month) {
                <div
                  class="day-cell"
                  [class.other-month]="!day.isCurrentMonth"
                  [class.selected]="day.date === selectedDay() && day.isCurrentMonth"
                  [class.today]="isToday(day)"
                >
                  <span class="date-number">{{ day.date }}</span>
                  @if (day.isCurrentMonth) {
                    <span class="day-name">{{ getDayName(day.dayOfWeek).substring(0, 3) }}</span>
                  }
                </div>
              }
            </div>
          </div>
        }
      </section>

      <section class="instructions">
        <h2>📖 How to Use This Tool</h2>
        <div class="instruction-content">
          <p>
            <strong
              >This perpetual calendar helps you find what day of the week any date falls
              on.</strong
            >
          </p>

          <ol>
            <li>
              <strong>Find a Specific Date:</strong> Use the date picker or manually enter month,
              day, and year above
            </li>
            <li>
              <strong>View the Day:</strong> The tool instantly shows what day of the week that date
              is
            </li>
            <li>
              <strong>See the Month:</strong> The month calendar shows all dates with their days
            </li>
            <li><strong>Lookup Years:</strong> Use the year lookup tool below to see patterns</li>
          </ol>

          <div class="tip-box">
            <strong>💡 Tip:</strong> Click on the month calendar to see all dates and their
            corresponding days of the week at a glance!
          </div>
        </div>
      </section>

      <section class="year-lookup">
        <h2>🔍 Year Lookup - All Months Overview</h2>
        <div class="search-section">
          <label for="yearSearch">Select Year to View All Months:</label>
          <input
            id="yearSearch"
            type="number"
            [value]="searchYear()"
            (input)="onYearSearch($event)"
            min="1900"
            max="2100"
            placeholder="Enter year (e.g., 2024)"
            class="year-search"
          />
          @if (selectedYearInfo()) {
            <div class="year-info-box">
              <h3>{{ selectedYearInfo()!.year }}</h3>
              <p>
                <strong>Type:</strong>
                {{ selectedYearInfo()!.isLeapYear ? 'Leap Year' : 'Common Year' }} ({{
                  selectedYearInfo()!.isLeapYear ? '366' : '365'
                }}
                days)
              </p>
              <p>
                <strong>January 1st starts on:</strong>
                {{ getDayName(selectedYearInfo()!.startDay) }}
              </p>
            </div>
          }
        </div>

        <div class="months-overview">
          <h3>All Months in {{ searchYear() }}</h3>
          <p class="overview-desc">
            This table shows what day of the week each month starts on in {{ searchYear() }}
          </p>
          <table class="months-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Starts On</th>
                <th>Days in Month</th>
                <th>Ends On</th>
              </tr>
            </thead>
            <tbody>
              @for (monthData of yearMonthsData(); track monthData.monthIndex) {
                <tr>
                  <td class="month-name-cell">{{ monthData.monthName }}</td>
                  <td class="start-day-cell">
                    <span class="day-badge">{{ monthData.startDay }}</span>
                  </td>
                  <td class="days-count-cell">{{ monthData.daysInMonth }}</td>
                  <td class="end-day-cell">{{ monthData.endDay }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <section class="years-table-section">
        <h2>📅 Years Quick Reference (1900-2100)</h2>
        <p class="section-desc">
          Find any year to see if it's a leap year and what day January 1st falls on
        </p>
        <div class="table-wrapper">
          <table class="years-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Type</th>
                <th>January 1st</th>
                <th>Days</th>
              </tr>
            </thead>
            <tbody>
              @for (yearInfo of yearsData(); track yearInfo.year) {
                <tr [class.highlight]="yearInfo.year === searchYear()">
                  <td class="year-cell">{{ yearInfo.year }}</td>
                  <td>
                    <span class="badge" [class.leap]="yearInfo.isLeapYear">
                      {{ yearInfo.isLeapYear ? 'Leap Year' : 'Common Year' }}
                    </span>
                  </td>
                  <td>{{ getDayName(yearInfo.startDay) }}</td>
                  <td>{{ yearInfo.isLeapYear ? '366' : '365' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <section class="patterns-section">
        <h2>📊 Understanding Leap Years</h2>

        <div class="leap-year-rules">
          <h3>🔢 Leap Year Rules</h3>
          <p>A year is a leap year if:</p>
          <ul>
            <li>It's divisible by 4 <strong>AND</strong></li>
            <li>If it's divisible by 100, it must also be divisible by 400</li>
          </ul>
          <p class="examples">
            <strong>Examples:</strong> 2024 is a leap year (÷4). 2000 was a leap year (÷400). 1900
            was NOT a leap year (÷100 but not ÷400).
          </p>
        </div>

        <div class="patterns-grid">
          <div class="pattern-card">
            <h3>Common Year</h3>
            <p><strong>365 days total</strong></p>
            <ul>
              <li>February has 28 days</li>
              <li>Standard calendar year</li>
            </ul>
          </div>

          <div class="pattern-card leap">
            <h3>Leap Year</h3>
            <p><strong>366 days total</strong></p>
            <ul>
              <li>February has 29 days</li>
              <li>Extra day = Feb 29th</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="quick-tips">
        <h2>💡 Quick Tips</h2>
        <div class="tips-grid">
          <div class="tip-card">
            <h4>Find a Day for Any Date</h4>
            <p>
              Use the date finder at the top to enter any date and instantly see what day of the
              week it is.
            </p>
          </div>
          <div class="tip-card">
            <h4>View All Months in a Year</h4>
            <p>
              Enter a year in the Year Lookup section to see a table showing what day each month
              starts on.
            </p>
          </div>
          <div class="tip-card">
            <h4>Check Leap Years</h4>
            <p>
              Leap years have 366 days and February has 29 days. Look for the green "Leap Year"
              badge.
            </p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: `
    .perpetual-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      color: #1976d2;
      font-size: 2.5rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    h2 {
      color: #333;
      font-size: 1.8rem;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 3px solid #1976d2;
    }

    section {
      margin-bottom: 3rem;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .date-finder {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .date-finder h2 {
      color: white;
      border-bottom-color: rgba(255, 255, 255, 0.3);
    }

    .date-finder-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .date-input-group {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .manual-inputs {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .input-field {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
      min-width: 150px;
    }

    .input-field label {
      font-weight: 600;
      font-size: 0.95rem;
    }

    .date-input,
    .month-select,
    .day-input,
    .year-input {
      padding: 0.75rem 1rem;
      font-size: 1.1rem;
      border: 2px solid rgba(255, 255, 255, 0.5);
      border-radius: 4px;
      background: white;
      color: #333;
    }

    .or-divider {
      text-align: center;
      font-weight: bold;
      padding: 0.5rem 0;
      color: rgba(255, 255, 255, 0.8);
    }

    .date-result {
      background: rgba(255, 255, 255, 0.95);
      color: #333;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .result-header h3 {
      color: #1976d2;
      font-size: 2rem;
      margin: 0;
    }

    .day-badge {
      background: #4caf50;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .result-details {
      font-size: 1.2rem;
      color: #555;
      margin: 0;
    }

    .month-calendar-view {
      background: #f5f5f5;
    }

    .month-view-container {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .month-title {
      text-align: center;
      color: #1976d2;
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 4px;
      max-width: 800px;
      margin: 0 auto;
    }

    .day-header {
      text-align: center;
      font-weight: bold;
      color: #666;
      padding: 0.75rem;
      background: #f0f0f0;
      font-size: 0.9rem;
    }

    .day-cell {
      aspect-ratio: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      border: 1px solid #e0e0e0;
      background-color: white;
      gap: 0.25rem;
      transition: all 0.2s;
    }

    .day-cell:hover {
      background-color: #f5f5f5;
      cursor: pointer;
    }

    .date-number {
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
    }

    .day-name {
      font-size: 0.7rem;
      color: #666;
      text-transform: uppercase;
    }

    .day-cell.other-month {
      background-color: #fafafa;
      opacity: 0.5;
    }

    .day-cell.other-month .date-number,
    .day-cell.other-month .day-name {
      color: #ccc;
    }

    .day-cell.selected {
      background-color: #1976d2;
      border-color: #1976d2;
    }

    .day-cell.selected .date-number,
    .day-cell.selected .day-name {
      color: white;
      font-weight: bold;
    }

    .day-cell.today {
      border: 2px solid #4caf50;
    }

    .instructions {
      background: #e3f2fd;
    }

    .instruction-content ol {
      margin-left: 1.5rem;
      line-height: 1.8;
    }

    .instruction-content li {
      margin-bottom: 0.5rem;
    }

    .tip-box {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 1rem;
      margin-top: 1rem;
      border-radius: 4px;
    }

    .search-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .search-section label {
      font-weight: 600;
      color: #555;
    }

    .year-search {
      padding: 0.75rem 1rem;
      font-size: 1.1rem;
      border: 2px solid #1976d2;
      border-radius: 4px;
      max-width: 300px;
    }

    .year-info-box {
      background: #f5f5f5;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #4caf50;
    }

    .year-info-box h3 {
      color: #1976d2;
      font-size: 2rem;
      margin: 0 0 1rem 0;
    }

    .year-info-box p {
      margin: 0.5rem 0;
      font-size: 1.1rem;
    }

    .table-wrapper {
      overflow-x: auto;
      margin-top: 1rem;
    }

    .years-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.95rem;
    }

    .years-table thead {
      background: #1976d2;
      color: white;
      position: sticky;
      top: 0;
    }

    .years-table th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
    }

    .years-table td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .years-table tbody tr:hover {
      background: #f5f5f5;
    }

    .years-table tr.highlight {
      background: #fff3cd !important;
      border-left: 4px solid #ffc107;
    }

    .year-cell {
      font-weight: 600;
      color: #1976d2;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
      background: #e0e0e0;
      color: #333;
    }

    .badge.leap {
      background: #4caf50;
      color: white;
    }

    .pattern-cell {
      font-family: monospace;
      color: #666;
    }

    .patterns-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin: 1.5rem 0;
    }

    .pattern-card {
      background: #f9f9f9;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
    }

    .pattern-card.leap {
      background: #e8f5e9;
      border-color: #4caf50;
    }

    .pattern-card h3 {
      color: #1976d2;
      margin-top: 0;
    }

    .pattern-card.leap h3 {
      color: #2e7d32;
    }

    .pattern-card ul {
      margin-left: 1.5rem;
    }

    .pattern-card p {
      margin: 0.5rem 0;
    }

    .months-overview {
      margin-top: 2rem;
    }

    .months-overview h3 {
      color: #1976d2;
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .overview-desc {
      color: #666;
      margin-bottom: 1.5rem;
    }

    .months-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
    }

    .months-table thead {
      background: #1976d2;
      color: white;
    }

    .months-table th {
      padding: 1rem;
      text-align: left;
      font-weight: 600;
    }

    .months-table td {
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .months-table tbody tr:hover {
      background: #f5f5f5;
    }

    .month-name-cell {
      font-weight: 600;
      color: #333;
      font-size: 1.05rem;
    }

    .start-day-cell,
    .end-day-cell {
      font-weight: 500;
    }

    .day-badge {
      background: #1976d2;
      color: white;
      padding: 0.35rem 0.75rem;
      border-radius: 15px;
      font-size: 0.9rem;
      font-weight: 600;
      display: inline-block;
    }

    .days-count-cell {
      text-align: center;
      color: #666;
    }

    .quick-tips {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
    }

    .quick-tips h2 {
      color: white;
      border-bottom-color: rgba(255, 255, 255, 0.3);
    }

    .tips-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .tip-card {
      background: rgba(255, 255, 255, 0.95);
      color: #333;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .tip-card h4 {
      color: #1976d2;
      margin-top: 0;
      margin-bottom: 0.75rem;
      font-size: 1.1rem;
    }

    .tip-card p {
      margin: 0;
      line-height: 1.6;
      color: #555;
    }

    .leap-year-rules {
      background: #e8f5e9;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 1.5rem;
    }

    .leap-year-rules h3 {
      color: #2e7d32;
      margin-top: 0;
    }

    .leap-year-rules ul {
      margin-left: 1.5rem;
    }

    .examples {
      margin-top: 1rem;
      font-size: 0.95rem;
      color: #555;
    }

    .section-desc {
      color: #666;
      font-size: 1.05rem;
      margin-bottom: 1.5rem;
    }

    .reference-tables {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .reference-card {
      background: #fafafa;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1rem;
    }

    .reference-card h4 {
      color: #1976d2;
      margin: 0 0 1rem 0;
      font-size: 1.1rem;
    }

    .month-days {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .month-day-row {
      background: white;
      padding: 0.75rem;
      border-radius: 4px;
      border-left: 3px solid #1976d2;
    }

    .month-day-row.leap {
      border-left-color: #4caf50;
    }

    .month-label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .days-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      font-size: 0.85rem;
    }

    .month-item {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      background: #f0f0f0;
      border-radius: 3px;
    }

    @media (max-width: 768px) {
      .perpetual-container {
        padding: 1rem;
      }

      h1 {
        font-size: 1.8rem;
      }

      section {
        padding: 1rem;
      }

      .reference-tables,
      .patterns-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class PerpetualCalendar {
  private readonly currentDate = new Date();
  protected readonly searchYear = signal(this.currentDate.getFullYear());
  protected readonly selectedYearInfo = computed(() => this.getYearInfo(this.searchYear()));

  // Date finder signals
  private readonly today = new Date();
  protected readonly selectedMonth = signal(this.today.getMonth());
  protected readonly selectedDay = signal(this.today.getDate());
  protected readonly selectedDateYear = signal(this.today.getFullYear());

  protected readonly selectedDate = computed(() => {
    const year = this.selectedDateYear();
    const month = this.selectedMonth();
    const day = this.selectedDay();
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  });

  protected readonly selectedDateInfo = computed(() => {
    const year = this.selectedDateYear();
    const month = this.selectedMonth();
    const day = this.selectedDay();
    const date = new Date(year, month, day);
    return {
      date: day,
      month: month,
      year: year,
      dayOfWeek: date.getDay(),
      isCurrentMonth: true,
    };
  });

  protected readonly maxDaysInSelectedMonth = computed(() => {
    const month = this.selectedMonth();
    const year = this.selectedDateYear();
    if (month === 1) {
      return this.isLeapYear(year) ? 29 : 28;
    }
    return this.daysInMonth[month];
  });

  protected readonly monthCalendar = computed(() => {
    return this.generateMonth(this.selectedDateYear(), this.selectedMonth());
  });

  protected readonly yearMonthsData = computed(() => {
    const year = this.searchYear();
    const isLeap = this.isLeapYear(year);
    const monthsData = [];

    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const firstDayOfMonth = new Date(year, monthIndex, 1);
      const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

      let daysInThisMonth = this.daysInMonth[monthIndex];
      if (monthIndex === 1 && isLeap) {
        daysInThisMonth = 29;
      }

      monthsData.push({
        monthIndex,
        monthName: this.monthNames[monthIndex],
        startDay: this.dayNames[firstDayOfMonth.getDay()],
        endDay: this.dayNames[lastDayOfMonth.getDay()],
        daysInMonth: daysInThisMonth,
      });
    }

    return monthsData;
  });

  protected readonly yearsData = computed(() => {
    const years: YearInfo[] = [];
    for (let year = 1900; year <= 2100; year++) {
      years.push(this.getYearInfo(year));
    }
    return years;
  });

  private readonly dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  protected readonly monthNames = [
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
  private readonly daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  protected onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const dateValue = input.value;
    if (dateValue) {
      const date = new Date(dateValue);
      this.selectedDateYear.set(date.getFullYear());
      this.selectedMonth.set(date.getMonth());
      this.selectedDay.set(date.getDate());
    }
  }

  protected onMonthChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const month = parseInt(select.value, 10);
    this.selectedMonth.set(month);

    // Adjust day if it exceeds the new month's max days
    const maxDays = this.maxDaysInSelectedMonth();
    if (this.selectedDay() > maxDays) {
      this.selectedDay.set(maxDays);
    }
  }

  protected onDayChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const day = parseInt(input.value, 10);
    const maxDays = this.maxDaysInSelectedMonth();
    if (!isNaN(day) && day >= 1 && day <= maxDays) {
      this.selectedDay.set(day);
    }
  }

  protected onDateYearChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const year = parseInt(input.value, 10);
    if (!isNaN(year) && year >= 1900 && year <= 2100) {
      this.selectedDateYear.set(year);

      // Adjust day if it exceeds the month's max days (e.g., Feb 29 in non-leap year)
      const maxDays = this.maxDaysInSelectedMonth();
      if (this.selectedDay() > maxDays) {
        this.selectedDay.set(maxDays);
      }
    }
  }

  protected formatDate(dateInfo: CalendarDay): string {
    const date = new Date(dateInfo.year, dateInfo.month, dateInfo.date);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  protected getFullMonthName(monthIndex: number): string {
    return this.monthNames[monthIndex];
  }

  protected isToday(day: CalendarDay): boolean {
    return (
      day.date === this.currentDate.getDate() &&
      day.month === this.currentDate.getMonth() &&
      day.year === this.currentDate.getFullYear()
    );
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
      const date = daysInPrevMonth - i;
      const dayDate = new Date(prevYear, prevMonth, date);
      days.push({
        date,
        month: prevMonth,
        year: prevYear,
        dayOfWeek: dayDate.getDay(),
        isCurrentMonth: false,
      });
    }

    // Current month's days
    for (let date = 1; date <= daysInMonth; date++) {
      const dayDate = new Date(year, month, date);
      days.push({
        date,
        month,
        year,
        dayOfWeek: dayDate.getDay(),
        isCurrentMonth: true,
      });
    }

    // Next month's leading days
    const remainingCells = 42 - days.length; // 6 rows × 7 days
    for (let date = 1; date <= remainingCells; date++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dayDate = new Date(nextYear, nextMonth, date);
      days.push({
        date,
        month: nextMonth,
        year: nextYear,
        dayOfWeek: dayDate.getDay(),
        isCurrentMonth: false,
      });
    }

    return days;
  }

  protected onYearSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const year = parseInt(input.value, 10);
    if (!isNaN(year) && year >= 1900 && year <= 2100) {
      this.searchYear.set(year);
    }
  }

  protected getDayName(dayIndex: number): string {
    return this.dayNames[dayIndex];
  }

  protected getMonthStartDays(
    jan1Day: number,
    isLeap: boolean,
  ): Array<{ name: string; day: string }> {
    const shortMonthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const months = [];
    let currentDay = jan1Day;

    for (let i = 0; i < 12; i++) {
      months.push({
        name: shortMonthNames[i],
        day: this.dayNames[currentDay],
      });

      let daysInThisMonth = this.daysInMonth[i];
      if (i === 1 && isLeap) {
        daysInThisMonth = 29; // February in leap year
      }

      currentDay = (currentDay + (daysInThisMonth % 7)) % 7;
    }

    return months;
  }

  private getYearInfo(year: number): YearInfo {
    const isLeapYear = this.isLeapYear(year);
    const startDay = this.getJanuaryFirstDay(year);
    const category = `${isLeapYear ? 'L' : 'C'}-${this.dayNames[startDay].substring(0, 3)}`;

    return {
      year,
      isLeapYear,
      startDay,
      category,
    };
  }

  private isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  private getJanuaryFirstDay(year: number): number {
    // Using Zeller's Congruence algorithm for January 1st
    const date = new Date(year, 0, 1);
    return date.getDay();
  }
}
