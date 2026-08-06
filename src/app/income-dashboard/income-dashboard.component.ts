import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartType, ChartData} from 'chart.js';

@Component({
  selector: 'app-income-dashboard',
  templateUrl: './income-dashboard.component.html',
  styleUrls: ['./income-dashboard.component.css']
})


export class IncomeDashboardComponent implements OnInit {

  activeMenu: string = 'income';
  username:string='';
  incomeForm: FormGroup;
  incomeDetails: any[] = []; 
  items: any[] = []; 
  income = {
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
    this.incomeForm = this.fb.group({
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
    .get<Income[]>(`http://localhost:8080/getIncomeDetails?username=${this.username}`, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      }),
    })
    .subscribe(
      (response) => {
        this.incomeDetails = response;
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
    const modal = new bootstrap.Modal(document.getElementById('incomeModal'));
    modal.show();
  }

  submitIncome(): void {
    if (this.incomeForm.valid) {
      const incomeData = this.incomeForm.value;
      const username = localStorage.getItem('username'); 
      const apiUrl = `http://localhost:8080/addIncome?username=${username}`; 
  
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        'Content-Type': 'application/json'
      });
      this.http.post(apiUrl, incomeData, { headers })
        .subscribe(
          (response) => {
            console.log('Income details submitted successfully:', response);
      
            this.incomeForm.reset();
            const modal = bootstrap.Modal.getInstance(document.getElementById('incomeModal'));
            alert('Income details added successfully!');
            modal.hide();
          },
          (error) => {
            console.error('Error submitting income details:', error);
            alert('There was an error submitting the income details.');
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
    const apiUrl = 'http://localhost:8080/deleteIncome';
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
    this.items = this.incomeDetails.map((income) => ({
      id : income.id,
      name: income.name,
      amount: income.amount,
      category: income.category,
      description: income.description,
      date: income.date,
    }));
  }

  populateChart(): void {
    const categoryTotals: { [key: string]: number } = {};

    this.incomeDetails.forEach((income) => {
      if (!categoryTotals[income.category]) {
        categoryTotals[income.category] = 0;
      }
      categoryTotals[income.category] += income.amount;
    });

    this.chartLabels = Object.keys(categoryTotals);
    this.chartData = {
      labels: this.chartLabels,
      datasets: [
        {
          data: Object.values(categoryTotals),
          label: 'Income by Category',
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

export interface Income {
  id : number,
  name: string;
  amount: number;
  category: string;
  description: string;
  date: number;
}
