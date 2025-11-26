from django.apps import AppConfig

class EcommerceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ecommerce'

    def ready(self):
        import stripe
        from django.conf import settings
        stripe.api_key = settings.STRIPE_SECRET_KEY



# import stripe

# from ecommerceApiProject import settings

# stripe.api_key = settings.STRIPE_SECRET_KEY
