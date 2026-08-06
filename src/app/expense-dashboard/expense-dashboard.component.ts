import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartType, ChartData} from 'chart.js';

@Component({
  selector: 'app-expense-dashboard',
  templateUrl: './expense-dashboard.component.html',
  styleUrls: ['./expense-dashboard.component.css']
})
export class ExpenseDashboardComponent {

  activeMenu: string = 'expense';
  username:string='';
  expenseForm: FormGroup;
  expenseDetails: any[] = []; 
  items: any[] = []; 
  expense = {
    name: '',
    amount: 0,
    category: '',
    description: '',
    date: ''
  };
  chartLabels: string[] = []; 
  chartData: ChartData<'bar'> = {
    labels: [], 
    datasets: [], 
  };
  chartType: ChartType = 'bar'; 
  chartOptions: any; 

  constructor(private http :HttpClient, private router:Router,private fb: FormBuilder){
    this.expenseForm = this.fb.group({
      name: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      description: [''],
      date: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    this.username = localStorage.getItem('username') || '';
    this.http
    .get<Expense[]>(`http://localhost:8080/getExpenseDetails?username=${this.username}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      }),
    })
    .subscribe(
      (response) => {
        this.expenseDetails = response; 
        this.populateTable();
        this.populateChart();
        console.log(response);
      },
      (error) => {
        console.error('Error fetching user Details:', error);
      }
    );
  } 

  openModal(): void {
    const modal = new bootstrap.Modal(document.getElementById('expenseModal'));
    modal.show();
  }

  submitIncome(): void {
    if (this.expenseForm.valid) {
      const expenseData = this.expenseForm.value;
      const username = localStorage.getItem('username'); 
      const apiUrl = `http://localhost:8080/addExpense?username=${username}`; 
  
      // Preparing headers with the JWT token for authorization
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        'Content-Type': 'application/json'
      });
      this.http.post(apiUrl, expenseData, { headers })
        .subscribe(
          (response) => {
            console.log('Expense details submitted successfully:', response);
            this.expenseForm.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('expenseModal'));
            alert('Expense details added successfully!');
            modal.hide();
          },
          (error) => {
            console.error('Error submitting expense details:', error);
            alert('There was an error submitting the expense details.');
          }
        );
    } else {
      alert('Please fill in all required fields.');
    }
  }
  
  setActiveMenu(menu: string): void {
    this.activeMenu = menu; 
  }
  
  navigateToDashboard(menu: string) {
    switch (menu) {
      case 'dashboard':
        this.router.navigate(['/dashboard']); 
        break;
      case 'income':
        this.router.navigate(['/income-dashboard']); 
        break;
      case 'expense':
        this.router.navigate(['/expense-dashboard']); 
        break;
      default:
        break;
    }
  }

  selectAll(event: any) {
    const isChecked = event.target.checked;
    this.items.forEach(item => item.selected = isChecked);
  }

  editItem(index: number) {
    const item = this.items[index];
    console.log('Editing item: ', item);
  }

  deleteItem(id: number) {
    const apiUrl = 'http://localhost:8080/deleteExpense'; 
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json'
    }); 
    const confirmDelete = confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      this.http.delete(`${apiUrl}/${id}`, { headers }).subscribe(
        () => {
          console.log(`Item with id ${id} deleted successfully`);
          this.items = this.items.filter(item => item.id !== id);
        },
        (error) => {
          console.error('Error deleting item:', error);
        }
      );
    }
  }

  populateTable(): void {
    this.items = this.expenseDetails.map((expense) => ({
      id : expense.id,
      name: expense.name,
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    }));
  }

  populateChart(): void {
    const categoryTotals: { [key: string]: number } = {};

    this.expenseDetails.forEach((expense) => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
    });

    this.chartLabels = Object.keys(categoryTotals);
    this.chartData = {
      labels: this.chartLabels,
      datasets: [
        {
          data: Object.values(categoryTotals),
          label: 'expense by Category',
          backgroundColor: '#2e6bbf',
          borderColor: '#1e4d87',
          barThickness:20,
          borderWidth: 1,
        },
      ],
    };
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
    };
  }

  logout(): void {
    localStorage.removeItem('jwtToken'); 
    this.router.navigate(['/login']); 
  }
}

export interface Expense {
  id : number,
  name: string;
  amount: number;
  category: string;
  description: string;
  date: number;
}



