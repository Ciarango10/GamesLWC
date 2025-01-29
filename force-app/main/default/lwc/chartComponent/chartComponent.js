import { LightningElement, wire } from 'lwc';
import ChartJs from '@salesforce/resourceUrl/ChartJs';
import { loadScript } from 'lightning/platformResourceLoader';
import getGamesSalesData from '@salesforce/apex/DashboardController.getGamesSalesData';

export default class ChartComponent extends LightningElement {
    chart;
    gamesData = [];

    @wire(getGamesSalesData)
    wiredGamesData({ error, data }) {
        if (data) {
            this.gamesData = data.map(game => ({
                gameName: game.Name,
                totalSales: game.Sales__c
            }));
            this.initializeChart();
        } else if (error) {
            console.error('Error fetching games data:', error);
        }
    }

    renderedCallback() {
        if (this.chart) {
            return; 
        }
        // Load the Chart.js library
        loadScript(this, ChartJs)
            .then(() => {
                this.initializeChart();
            })
            .catch(error => {
                console.error('Error loading Chart.js:', error);
            });
    }

    initializeChart() {
        const ctx = this.template.querySelector('canvas').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.gamesData.map(game => game.gameName),
                datasets: [
                    {
                        label: 'Total Sales',
                        data: this.gamesData.map(game => game.totalSales),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 205, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(201, 203, 207, 0.2)',
                            'rgba(0, 128, 128, 0.2)',   
                            'rgba(220, 20, 60, 0.2)',   
                            'rgba(255, 140, 0, 0.2)',   
                            'rgba(128, 0, 128, 0.2)'   
                        ],
                        borderColor: [
                            'rgb(255, 99, 132)',
                            'rgb(255, 159, 64)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(54, 162, 235)',
                            'rgb(153, 102, 255)',
                            'rgb(201, 203, 207)',
                            'rgb(0, 128, 128)',  
                            'rgb(220, 20, 60)',  
                            'rgb(255, 140, 0)',  
                            'rgb(128, 0, 128)'   
                        ],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}