from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Customer(AbstractUser):
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
    Category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="categories")

    def __str__(self):
        return f"{self.name} ({self.category.name})"
