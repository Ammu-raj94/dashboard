# -*- coding: utf-8 -*-

{
    'name': "Custom Dashboard",
    'version': '15.0.1.0.0',
    'category': 'Productivity',
    'summary': """Custom Dashboard for Sales and Account""",
    'description': "",
    'author': '',
    'company': '',
    'maintainer': '',
    'website': "",
    'depends': ['sale_management', 'account', 'sale_margin'],
    'data': ['views/menus.xml'],
    'assets': {
        'web.assets_backend': [
            'https://cdn.jsdelivr.net/npm/chart.js',
            'custom_dashboard/static/src/js/custom_dashboard_action.js',
            'custom_dashboard/static/src/css/dashboard.css',

        ],
        'web.assets_qweb': [
            'custom_dashboard/static/src/xml/custom_dashboard_templates.xml'],
    },
    'license': 'AGPL-3',
    'installable': True,
    'auto_install': False,
    'application': True,
}
