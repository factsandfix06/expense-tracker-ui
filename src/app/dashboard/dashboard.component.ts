import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartType, ChartData} from 'chart.js';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent {

  transactions:string[]=[];
  dashboardDetails: DashboardDetailsDTO | null = null;  
  activeMenu: string = 'dashboard';
  username:string='';
  cards: { title: string; value: string }[] = [];
  chartLabels: string[] = []; 
  chartData: ChartData<'bar'> = {
      labels: [], 
      datasets: [], 
    };
  chartType: ChartType = 'bar'; 
  chartOptions: any; 
  

  constructor(private http: HttpClient, private router:Router){}

  ngOnInit():void{
    this.username = localStorage.getItem('username') || '';
    this.http
  .get<DashboardDetailsDTO>(`http://localhost:8080/getTransactions?username=${this.username}`, {
    headers: new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
    }),
  })
  .subscribe(
    (response) => {
      console.log(response);
      this.dashboardDetails = response;
      this.cards = [
        { title: 'Income', value: `$${response.income}` },
        { title: 'Expenses', value: `$${response.expense}` },
        { title: 'Savings', value: `$${response.savings}` },
        { title: 'Investments', value: `$${response.investments}` },
      ];
      this.populateChart();
    },
    (error) => {
      console.error('Error fetching user Details:', error);
    }
  );
}

setActiveMenu(menu: string): void {
  this.activeMenu = menu; 
}

navigateToDashboard(menu: string) {
  switch (menu) {
    case 'dashboard':
      this.router.navigate(['/dashboard']); // Replace with your dashboard route
      break;
    case 'income':
      this.router.navigate(['/income-dashboard']); // Replace with your income route
      break;
    case 'expense':
      this.router.navigate(['/expense-dashboard']); // Replace with your expense route
      break;
    default:
      break;
  }
}

populateChart(): void {
  if (!this.dashboardDetails) return;

  const transactionTotals: { [key: string]: number } = {
    Income: this.dashboardDetails.income,
    Expense: this.dashboardDetails.expense,
    Savings: this.dashboardDetails.savings,
    Investments: this.dashboardDetails.investments,
  };

  this.chartLabels = Object.keys(transactionTotals);

    // Data for the chart
    this.chartData = {
      labels: this.chartLabels,
      datasets: [
        {
          data: Object.values(transactionTotals),
          label: 'Transaction by Type',
          backgroundColor: [
            '#2e6bbf',  // Income
            '#333',  // Expense
            '#2e6bbf',  // Savings
            '#333',  // Investments
          ],
          borderColor:'#333',
          borderWidth: 1,
          barThickness: 20,
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
    };
  }

logout(): void {
  localStorage.removeItem('jwtToken'); // Remove token from localStorage
  this.router.navigate(['/login']); // Redirect to the login page
}

}

export interface DashboardDetailsDTO {
  name: string;
  expense: number;
  income: number;
  savings: number;
  investments: number;
}
