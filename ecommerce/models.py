from django.db import models
from django.contrib.auth.models import AbstractUser


ORDER_STATUS_CHOICES =[
    ('created', 'Created'),
    ('pending', 'Pending'),
    ('cancelled', 'Cancelled'),
    ('deilvered', 'Delivered'),
]

PAYMENT_STATUS_CHOICE = [
    ('sucessful', 'Sucessful'),
    ('pending', 'Pending'),
    ('processing', 'Processing'),
    ('cancelled', 'Cancelled')
]


# Create your models here.

class User(AbstractUser):
    '''Custom user model that uses email as the primary identifier'''
    email = models.EmailField( unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
    
class Category(models.Model):
    '''Model tha represent the main product category'''
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
    
class SubCategory(models.Model):
    '''Model that represent a sub-category under a main category'''
    name = models.CharField(max_length=50, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="categories")

    def __str__(self):
        return f"{self.name} ({self.category.name})"
    
class Product(models.Model):
    '''Represent a product in a store'''
    name = models.CharField(max_length=20)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    sub_category = models.ForeignKey(SubCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    amount_in_stock = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    '''Hold image for product'''
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='product_images/')

    def __str__(self):
        return f"Image for {self.product.name}"
    
class Cart(models.Model):
    '''Represnt a shopping carrt belonging to a user'''
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='carts')

    def __str__(self):
        return f"Cart for {self.user.email}"

class CartProduct(models.Model):
    '''Many-to-Many link between Cart and Product'''
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'product')

    def __str__(self):
        return f"{self.product.name} x {self.quantity} in {self.cart.user.email}'s cart"
    
class Order(models.Model):
    '''Represent a customer order'''
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='orders')
    order_from = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_ordered')
    status = models.CharField(max_length=10, default='created', choices=ORDER_STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)


class Rating(models.Model):
    '''Represent product review by users'''
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='rating')
    rating_from = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings')
    stars = models.PositiveSmallIntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.stars} - {self.product.name} by {self.rating_from.email}"
    
    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(stars__gte=1, stars__lte=5),
                name="valid_star_range"
            )
        ]

class Comment(models.Model):
    '''User comments on the a product'''
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='comments')
    comment_from = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.comment_from.email} on {self.product.name}"
    
class Payment(models.Model):
    '''Stripe compatible payment model'''
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment')
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    stripe_payment_intent = models.CharField(max_length=255, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default="usd")
    status = models.CharField(max_length=50, default='processing', choices=PAYMENT_STATUS_CHOICE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.status.upper()} - {self.amount} {self.currency}"









