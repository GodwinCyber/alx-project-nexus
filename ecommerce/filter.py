import django_filters
from .models import Product, Category, SubCategory, ProductImage


class CategoryFilter(django_filters.FilterSet):
    '''Filter for Category model'''
    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')

    class Meta:
        model = Category
        fields = ['name']


class SubCategoryFilter(django_filters.FilterSet):
    '''Filter for SubCategory model'''
    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
    category = django_filters.NumberFilter(field_name='category__id')

    class Meta:
        model = SubCategory
        fields = ['name', 'category']

class ProductFilter(django_filters.FilterSet):
    '''Filter for Product model'''
    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
    category = django_filters.NumberFilter(field_name='category__id')
    subcategory = django_filters.NumberFilter(field_name='sub_category__id')
    price__gte = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price__lte = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    stock__gte = django_filters.NumberFilter(field_name='amount_in_stock', lookup_expr='gte')
    stock__lte = django_filters.NumberFilter(field_name='amount_in_stock', lookup_expr='lte')

    low_stock = django_filters.BooleanFilter(method='filter_low_stock') 

    def filter_low_stock(self, queryset, name, value):
        '''Filter products with low stock (less than 5)'''
        if value:
            return queryset.filter(amount_in_stock__lt=5)
        return queryset

    class Meta:
        model = Product
        fields = ['name', 'category', 'subcategory', 'price__gte', 'price__lte', 'stock__gte', 'stock__lte', 'low_stock']

class ProductImageFilter(django_filters.FilterSet):
    '''Filter for ProductImage model'''
    product = django_filters.NumberFilter(field_name='product__id')

    class Meta:
        model = ProductImage
        fields = ['product']

