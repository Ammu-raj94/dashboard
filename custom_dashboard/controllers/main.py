# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request



class DashboardController(http.Controller):
    @http.route('/get_dashboard_values', auth='user', type='json')
    def index(self):
        query ="""
        select rp.name,
		SUM(sol.price_subtotal - (sol.product_uom_qty*sol.purchase_price)) as total_margin,
		(select count(*) from sale_order where user_id = so.user_id and state = 'sale') as sale_count
        from res_users as ru
        inner join sale_order as so on ru.id = so.user_id
        inner join res_partner as rp on ru.partner_id = rp.id
        inner join sale_order_line as sol on so.id = sol.order_id
		where so.state = 'sale'
        group by rp.name,so.user_id
        """
        request.cr.execute(query)
        sale_order_vals = request.cr.dictfetchall()
        invoice_query = """
            select rp.name, rp.id,
            sum(am.amount_total) as invoiced_amount,
            (select count(*) from account_move where partner_id = rp.id and move_type='out_invoice') as invoice_count
            from account_move as am
            inner join res_partner as rp on am.partner_id = rp.id
            where am.move_type='out_invoice' and am.state='posted'
            group by rp.name,rp.id
        """
        request.cr.execute(invoice_query)
        invoice_vals = request.cr.dictfetchall()
        return sale_order_vals,invoice_vals
