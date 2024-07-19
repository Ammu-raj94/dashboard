odoo.define('custom_dashboard.dashboard_action', function(require) {
    "use strict";
    var AbstractAction = require('web.AbstractAction');
    var core = require('web.core');
    var rpc = require('web.rpc');
    var qweb = core.qweb;

    var CustomDashBoard = AbstractAction.extend({
        template: 'CustomDashBoard',
        selector: '.invoice_table',
        events: {
            'change #client_filter': 'changeClient',
        },
        changeClient: function(ev) {
            let filtered_data = [];
            if (ev.target.value == -1) {
                this.renderInvoiceTable(this.all_data[1]);
                return true;
            }
            for (var i in this.all_data[1]) {
                if (this.all_data[1][i].id == ev.target.value) {
                    filtered_data.push(this.all_data[1][i])
                }
            }
            this.renderInvoiceTable(filtered_data);
        },
        //            Start function which call the function for rendering dashboard
        start: function() {
            var self = this;
            this.set("title", 'Dashboard');
            this._super();
            self.renderDashboard();
        },
        //        Function which fetch data for dashboard from backend
        getSalesDetails: async function() {
            let value = await rpc.query({
                route: '/get_dashboard_values',
                args: [
                    []
                ],
            }).then((result) => {
                return result
            });
            return value;
        },
        //           Function which render invoice filter
        renderFilter: function(data) {
            let parentElement = this.$el.find('#invoiceFilter');
            let filters = $(qweb.render("filterClientInvoice", {
                'invoice_client': data
            }));
            parentElement.empty();
            parentElement.append(filters);
        },
        //           Function which render invoice table
        renderInvoiceTable: function(data) {
            let parentElement = this.$el.find('#invoiced_amount_table');
            let invoiced = $(qweb.render("InvoiceTableView", {
                'invoice_data': data
            }));
            parentElement.empty();
            parentElement.append(invoiced);
        },
        //            Function which render pie chart
        renderDashboard: async function() {
            let all_details = await this.getSalesDetails();
            var sale_count_pie = this.$el.find('#SaleCountPie')[0].getContext('2d');
            var sale_profit_pie = this.$el.find('#SaleProfitPie')[0].getContext('2d');
            var invoice_count_pie = this.$el.find('#InvoiceCountPie')[0].getContext('2d');
            this.all_data = all_details;
            let sales_persons = []
            let sales_count = []
            let sales_profit = []
            for (var sale in all_details[0]) {
                sales_persons.push(all_details[0][sale].name)
                sales_count.push(all_details[0][sale].sale_count)
                sales_profit.push(all_details[0][sale].total_margin)
            }
            let client = []
            let invoice_count = []
            let invoiced_amount = []
            for (var invoice in all_details[1]) {
                client.push(all_details[1][invoice].name)
                invoice_count.push(all_details[1][invoice].invoice_count)
                invoiced_amount.push(all_details[1][invoice].invoiced_amount)

            }
            let sales = $(qweb.render("SaleTableView", {
                'sales_data': all_details[0]
            }));
            this.$el.find('#sales_count_table').append(sales);
            this.renderFilter(all_details[1]);
            this.renderInvoiceTable(all_details[1]);
            //            Pie Chart for sale count
            new Chart(sale_count_pie, {
                type: 'pie',
                data: {
                    labels: sales_persons,
                    datasets: [{
                        label: '# of Votes',
                        data: sales_count,
                        borderWidth: 1,
                        borderColor: '#FF6384',
                        backgroundColor: ['#f7464a', '#46bfbd', '#fdb45c'],

                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            //            Pie Chart for sale profit
            new Chart(sale_profit_pie, {
                type: 'pie',
                data: {
                    labels: sales_persons,
                    datasets: [{
                        label: '# of Votes',
                        data: sales_profit,
                        borderWidth: 1,
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#4BC0C0',
                            '#9966FF',
                            '#FF9F40'
                        ],
                        borderColor: '#FF6384',

                    }],
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                }
            });
            //            Pie Chart for invoice count
            new Chart(invoice_count_pie, {
                type: 'pie',
                data: {
                    labels: client,
                    datasets: [{
                        label: '# of Votes',
                        data: invoice_count,
                        borderWidth: 1,
                        backgroundColor: [
                            '#FFB6C1',
                            '#87CEFA',
                            '#FFFACD',
                            '#90EE90',
                            '#D8BFD8',
                            '#FFDAB9'
                        ],
                        borderColor: '#FFB6C1',
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        },
    })
    core.action_registry.add('custom_dashboard_tags', CustomDashBoard);
})
