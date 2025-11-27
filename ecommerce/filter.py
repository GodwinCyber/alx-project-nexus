import django_filters
from .models import (
    Category,
    Rating,
    SubCategory,
    Product,
    ProductImage,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Payment,
    Comment,
) 


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

class CartFilter(django_filters.FilterSet):
    '''Filter for Cart model'''
    user = django_filters.NumberFilter(field_name='user__id')

    class Meta:
        model = Cart
        fields = ['user']

class CartItemFilter(django_filters.FilterSet):
    '''Filter for CartItem model'''
    cart_id = django_filters.NumberFilter(field_name='cart__id')
    product_id = django_filters.NumberFilter(field_name='product__id')
    min_quantity = django_filters.NumberFilter(field_name='quantity', lookup_expr='gte')
    max_quantity = django_filters.NumberFilter(field_name='quantity', lookup_expr='lte')

    class Meta:
        model = CartItem
        fields = ['cart_id', 'product_id', 'min_quantity', 'max_quantity']

class OrderFilter(django_filters.FilterSet):
    '''Filter for Order model'''
    user_id = django_filters.NumberFilter(field_name='user__id')
    status = django_filters.CharFilter(field_name='status', lookup_expr='iexact')
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = Order
        fields = ['user_id', 'status', 'created_after', 'created_before']

class OrderItemFilter(django_filters.FilterSet):
    '''Filter for OrderItem model'''
    order_id = django_filters.NumberFilter(field_name='order__id')
    product_id = django_filters.NumberFilter(field_name='product__id')
    min_quantity = django_filters.NumberFilter(field_name='quantity', lookup_expr='gte')
    max_quantity = django_filters.NumberFilter(field_name='quantity', lookup_expr='lte')

    class Meta:
        model = OrderItem
        fields = ['order_id', 'product_id', 'min_quantity', 'max_quantity']


class RatingFilter(django_filters.FilterSet):
    '''Filter for Rating model'''
    product_id = django_filters.NumberFilter(field_name='product__id')
    rating_from_id = django_filters.NumberFilter(field_name='rating_from__id')
    min_rating = django_filters.NumberFilter(field_name='rating', lookup_expr='gte')
    max_rating = django_filters.NumberFilter(field_name='rating', lookup_expr='lte')

    class Meta:
        model = Rating
        fields = ['product_id', 'rating_from_id', 'min_rating', 'max_rating']

class CommentFilter(django_filters.FilterSet):
    '''Filter for Comment model'''
    product_id = django_filters.NumberFilter(field_name='product__id')
    comment_from_id = django_filters.NumberFilter(field_name='comment_from__id')
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = Comment
        fields = ['product_id', 'comment_from_id', 'created_after', 'created_before']

class PaymentFilter(django_filters.FilterSet):
    '''Filter for Payment model'''
    user_id = django_filters.NumberFilter(field_name='user__id')
    order_id = django_filters.NumberFilter(field_name='order__id')
    status = django_filters.CharFilter(field_name='status', lookup_expr='iexact')
    amount__gte = django_filters.NumberFilter(field_name='amount', lookup_expr='gte')
    amount__lte = django_filters.NumberFilter(field_name='amount', lookup_expr='lte')
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = Payment
        fields = ['user_id', 'order_id', 'status', 'amount__gte', 'amount__lte', 'created_after', 'created_before']





