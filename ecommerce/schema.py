import graphene
from graphene_django import DjangoObjectType
from graphene_file_upload.scalars import Upload
from .models import (
    User,
    Category,
    SubCategory,
    Product,
    ProductImage,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Rating,
    Payment,
    Comment,
)
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from graphene.types.decimal import Decimal
from graphene_django.filter import DjangoFilterConnectionField
from .filter import (
    CategoryFilter,
    SubCategoryFilter,
    ProductFilter,
    ProductImageFilter,
    CartFilter,
    CartItemFilter,
    OrderFilter,
    OrderItemFilter,
    RatingFilter,
    CommentFilter,
    PaymentFilter,
)
import stripe
from django.db import transaction
from decimal import Decimal
from graphene_file_upload.scalars import Upload

# ==========================
# GraphQL Object Types
# ==========================
class UserType(DjangoObjectType):
    '''GraphQL type for the User model'''
    class Meta:
        model = User
        fields = ('id', 'email', 'username')

class CategoryType(DjangoObjectType):
    '''GraphQL type for the Category model'''
    class Meta:
        model = Category
        filterset_class = CategoryFilter
        interfaces = (graphene.relay.Node,)
        fields = ('id', 'name')

class SubCategoryType(DjangoObjectType):
    '''GraphQL type for the SubCategory model'''
    class Meta:
        model = SubCategory
        filterset_class = SubCategoryFilter
        interfaces = (graphene.relay.Node,)
        fields = ('id', 'name', 'category')

class ProductType(DjangoObjectType):
    '''GraphQL type for the Product model'''
    class Meta:
        model = Product
        filterset_class = ProductFilter
        interfaces = (graphene.relay.Node,)
        fields = ('id', 'name', 'category', 'sub_category', 'description', 'price', 'amount_in_stock', 'created_at', 'updated_at')

class ProductImageType(DjangoObjectType):
    '''GraphQL type for the ProductImage model'''
    class Meta:
        model = ProductImage
        filterset_class = ProductImageFilter
        interfaces = (graphene.relay.Node,)
        fields = ('id', 'product', 'image')

class CartType(DjangoObjectType):
    '''GraphQL type for Cart model'''
    class Meta:
        model = Cart
        filterset_class = CartFilter
        fields = ('id', 'user')

class CartItemType(DjangoObjectType):
    '''GraphQL type for CartItem model'''
    class Meta:
        model = CartItem
        filterset_class = CartItemFilter
        interfaces = (graphene.relay.Node,)
        fields = ('id', 'cart', 'product', 'quantity')

class OrderType(DjangoObjectType):
    '''GraphQL type for Order model'''
    class Meta:
        model = Order
        filterset_class = OrderFilter
        interfaces = (graphene.relay.Node,)
        fields = ('id', 'user', 'status', 'created_at')

class OrderItemType(DjangoObjectType):
    '''GraphQL type for OrderItem model'''
    class Meta:
        model = OrderItem
        filterset_class = OrderItemFilter
        interfaces = (graphene.relay.Node,)
        fields = ('id', 'order', 'product', 'quantity')

class RatingType(DjangoObjectType):
    '''GrapghQL type for Rating model'''
    class Meta:
        model = Rating
        filterset_class = RatingFilter
        interfaces = (graphene.relay.Node,)
        fields = ('id', 'product', 'rating_from', 'stars', 'comment')

class CommentType(DjangoObjectType):
    '''GraphQL type for Comment model'''
    class Meta:
        model = Comment
        filterset_class = CommentFilter
        interfaces = (graphene.relay.Node,)
        fields = ('id', 'product', 'comment_from', 'body')

class PaymentType(DjangoObjectType):
    '''GraphQL type for Payment model'''
    class Meta:
        model = Payment
        filterset_class = PaymentFilter
        interfaces = (graphene.relay.Node,)
        fields = ('id', 'user', 'order', 'stripe_payment_intent', 'amount', 'currency', 'status')


# ==========================
# GraphQl inputs
# ==========================
class UserInput(graphene.InputObjectType):
    '''Input type for creating or updating a user'''
    email = graphene.String(required=True)
    username = graphene.String(required=True)
    password = graphene.String(required=True)

class CategoryInput(graphene.InputObjectType):
    '''Input type for creating or updating a category'''
    name = graphene.String(required=True)

class SubcategoryInput(graphene.InputObjectType):
    '''Input type for creating or updating a sub-category'''
    name = graphene.String(required=True)
    categoryId = graphene.Int(required=True)

class ProductInput(graphene.InputObjectType):
    '''Input type for creating or updating a product'''
    name = graphene.String(required=True)
    categoryId = graphene.Int(required=True)
    subCategoryId = graphene.Int()
    description = graphene.String()
    price = graphene.Decimal(required=True)
    amountInStock = graphene.Int(required=True)

class ProductImageInput(graphene.InputObjectType):
    '''Input type for creating or updating a product image'''
    product_id = graphene.Int(required=True)
    image = Upload(required=True)  # Use graphene-file-upload’s scalar to accept multipart file data

class CartInput(graphene.InputObjectType):
    '''Input type for creating or updating a cart'''
    user_id = graphene.Int(required=True)

class CartItemInput(graphene.InputObjectType):
    '''Input type for creating or updating a cart item'''
    cart_id = graphene.Int(required=True)
    product_id = graphene.Int(required=True)
    quantity = graphene.Int(required=True)

class OrderInput(graphene.InputObjectType):
    '''Input type for creating or updating an order'''
    user_id = graphene.Int(required=True)
    status = graphene.String(required=True)

class OrderItemInput(graphene.InputObjectType):
    '''Input type for creating or updating an order item'''
    order_id = graphene.Int(required=True)
    product_id = graphene.Int(required=True)
    quantity = graphene.Int(required=True)

class RatingInput(graphene.InputObjectType):
    '''Input type for creating or updating a rating'''
    product_id = graphene.Int(required=True)
    rating_from_id = graphene.Int(required=True)
    stars = graphene.Int(required=True)
    comment = graphene.String()

class CommentInput(graphene.InputObjectType):
    '''Input type for creating or updating a comment'''
    product_id = graphene.Int(required=True)
    comment_from_id = graphene.Int(required=True)
    body = graphene.String(required=True)

class PaymentInput(graphene.InputObjectType):
    '''Input type for creating or updating a payment'''
    user_id = graphene.Int(required=True)
    order_id = graphene.Int(required=True)
    stripe_payment_intent = graphene.String(required=True)
    amount = graphene.Decimal(required=True)
    currency = graphene.String(required=True)
    status = graphene.String(required=True)

# =========================
# GraphQL filter inputs
# =========================
class CategoryFilterInput(graphene.InputObjectType):
    '''Input type for filtering categories'''
    name = graphene.String()

class SubCategoryFilterInput(graphene.InputObjectType):
    '''Input type for filtering sub-categorys'''
    name = graphene.String()
    category = graphene.Int()

class ProductFilterInput(graphene.InputObjectType):
    '''Input type for filtering products'''
    name = graphene.String()
    category = graphene.Int()
    subcategory = graphene.Int()
    price__gte = graphene.Decimal()
    price__lte = graphene.Decimal()
    stock__gte = graphene.Int()
    stock__lte = graphene.Int()
    low_stock = graphene.Boolean()

class ProductImageFilterInput(graphene.InputObjectType):
    '''Input type for filtering product images'''
    product = graphene.Int()

class CartFilterInput(graphene.InputObjectType):
    '''Input type for filtering carts'''
    user = graphene.Int()

class CartItemFilterInput(graphene.InputObjectType):
    '''Input type for filtering cart items'''
    cart_id = graphene.Int()
    product_id = graphene.Int()
    min_quantity = graphene.Int()
    max_quantity = graphene.Int()

class OrderFilterInput(graphene.InputObjectType):
    '''Input type for filtering orders'''
    user_id = graphene.Int()
    status = graphene.String()
    created_after = graphene.DateTime()
    created_before = graphene.DateTime()

class OrderItemFilterInput(graphene.InputObjectType):
    '''Input type for filtering order items'''
    order_id = graphene.Int()
    product_id = graphene.Int()
    min_quantity = graphene.Int()
    max_quantity = graphene.Int()

class RatingFilterInput(graphene.InputObjectType):
    '''Input type for filtering ratings'''
    product_id = graphene.Int()
    rating_from_id = graphene.Int()
    min_stars = graphene.Int()
    max_stars = graphene.Int()

class CommentFilterInput(graphene.InputObjectType):
    '''Input type for filtering comments'''
    product_id = graphene.Int()
    comment_from_id = graphene.Int()
    created_after = graphene.DateTime()
    created_before = graphene.DateTime()

class PaymentFilterInput(graphene.InputObjectType):
    '''Input type for filtering payments'''
    user_id = graphene.Int()
    order_id = graphene.Int()
    status = graphene.String()
    amount__gte = graphene.Decimal()
    amount__lte = graphene.Decimal()
    created_after = graphene.DateTime()
    created_before = graphene.DateTime()

# ==========================
# GraphQL Mutations
# ==========================
class CreateUser(graphene.Mutation):
    '''Mutation to create a new user'''
    class Arguments:
        input = UserInput(required=True)

    user = graphene.Field(UserType)
    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, input):
        '''Create a new user with the provided input data'''
        email = input.email
        username = input.username
        password = input.password
        
        if User.objects.filter(email=email).exists():
            raise Exception("User with this email already exists.")
        
        user = User(
            email=email,
            username=username,
        ) # Create a new user instance
        user.set_password(password) # Hash the password before saving
        user.save()  # Save the user to the database
        return CreateUser(user=user, ok=True)

class LoginUser(graphene.Mutation):
    '''Mutation to login a user'''
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    access_token = graphene.String()
    refresh_token = graphene.String()
    user = graphene.Field(UserType)
    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, email, password):
        '''Authenticate user and return tokens'''
        user = authenticate(username=email, password=password)
        if user is None:
            raise Exception("Invalid email or password.")


        # Generate tokens (implementation depends on your token generation logic)
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        return LoginUser(
            access_token=str(access),
            refresh_token=str(refresh),
            user=user,
            ok=True,
        )

class CreateCategory(graphene.Mutation):
    '''Mutation to create a new category'''
    class Arguments:
        input = CategoryInput(required=True)

    category = graphene.Field(CategoryType)
    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, input):
        '''Create a new category with the provided input data'''
        name = input.name

        if Category.objects.filter(name=name).exists():
            raise Exception("Category with this name already exists.")
        category = Category(name=name)
        category.save()
        return CreateCategory(category=category, ok=True)

class UpdateCategory(graphene.Mutation):
    '''Mutation to update an existing category'''
    class Arguments:
        id = graphene.Int(required=True)
        input = CategoryInput(required=True)

    category = graphene.Field(CategoryType)
    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, id, input):
        '''Update an existing category with the provided input data'''
        try:
            category = Category.objects.get(pk=id)
        except Category.DoesNotExist:
            raise Exception("Category does not exist.")

        category.name = input.name
        category.save()
        return UpdateCategory(category=category, ok=True)
    
class DeleteCategory(graphene.Mutation):
    '''Mutation to delete an existing category'''
    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, id):
        '''Delete an existing category by ID'''
        try:
            category = Category.objects.get(pk=id)
        except Category.DoesNotExist:
            raise Exception("Category does not exist.")

        category.delete()
        return DeleteCategory(ok=True)

class CreateSubCategory(graphene.Mutation):
    '''Mutation to create a new sub-category'''
    class Arguments:
        input = SubcategoryInput(required=True)

    sub_category = graphene.Field(SubCategoryType)
    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, input):
        '''Create a new sub-category with the provided input data'''
        name = input.name
        category_id = input.categoryId

        try:
            category = Category.objects.get(pk=category_id)
        except Category.DoesNotExist:
            raise Exception("Category does not exist.")

        sub_category = SubCategory(name=name, category=category)
        sub_category.save()
        return CreateSubCategory(sub_category=sub_category, ok=True)

class UpdateSubCategory(graphene.Mutation):
    '''Mutation to update an existing sub-category'''
    class Arguments:
        id = graphene.Int(required=True)
        input = SubcategoryInput(required=True)

    sub_category = graphene.Field(SubCategoryType)
    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, id, input):
        '''Update an existing sub-category with the provided input data'''
        try:
            sub_category = SubCategory.objects.get(pk=id)
        except SubCategory.DoesNotExist:
            raise Exception("Sub-category does not exist.")

        sub_category.name = input.name
        try:
            category = Category.objects.get(pk=input.categoryId)
            sub_category.category = category
        except Category.DoesNotExist:
            raise Exception("Category does not exist.")

        sub_category.save()
        return UpdateSubCategory(sub_category=sub_category, ok=True)
    
class DeleteSubCategory(graphene.Mutation):
    '''Mutation to delete an existing sub-category'''
    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, id):
        '''Delete an existing sub-category by ID'''
        try:
            sub_category = SubCategory.objects.get(pk=id)
        except SubCategory.DoesNotExist:
            raise Exception("Sub-category does not exist.")

        sub_category.delete()
        return DeleteSubCategory(ok=True)

class CreateProduct(graphene.Mutation):
    '''Mutation to create a new product'''
    class Arguments:
        input = ProductInput(required=True)

    product = graphene.Field(ProductType)
    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, input):
        '''Create a new product with the provided input data'''
        name = input.name
        category_id = input.categoryId
        sub_category_id = input.subCategoryId
        description = input.description
        price = input.price
        amount_in_stock = input.amountInStock

        try:
            category = Category.objects.get(pk=category_id)
        except Category.DoesNotExist:
            raise Exception("Category does not exist.")

        sub_category = None
        if sub_category_id:
            try:
                sub_category = SubCategory.objects.get(pk=sub_category_id)
            except SubCategory.DoesNotExist:
                raise Exception("Sub-category does not exist.")

        product = Product(
            name=name,
            category=category,
            sub_category=sub_category,
            description=description,
            price=price,
            amount_in_stock=amount_in_stock
        )
        product.save()
        return CreateProduct(product=product, ok=True)
    
class UpdateProduct(graphene.Mutation):
    '''Mutation to update an existing product'''
    class Arguments:
        id = graphene.Int(required=True)
        input = ProductInput(required=True)

    product = graphene.Field(ProductType)
    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, id, input):
        '''Update an existing product with the provided input data'''
        try:
            product = Product.objects.get(pk=id)
        except Product.DoesNotExist:
            raise Exception("Product does not exist.")

        product.name = input.name
        try:
            category = Category.objects.get(pk=input.categoryId)
            product.category = category
        except Category.DoesNotExist:
            raise Exception("Category does not exist.")

        if input.subCategoryId:
            try:
                sub_category = SubCategory.objects.get(pk=input.subCategoryId)
                product.sub_category = sub_category
            except SubCategory.DoesNotExist:
                raise Exception("Sub-category does not exist.")
        else:
            product.sub_category = None

        product.description = input.description
        product.price = input.price
        product.amount_in_stock = input.amountInStock
        product.save()
        return UpdateProduct(product=product, ok=True)

class DeleteProduct(graphene.Mutation):
    '''Mutation to delete an existing product'''
    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, id):
        '''Delete an existing product by ID'''
        try:
            product = Product.objects.get(pk=id)
        except Product.DoesNotExist:
            raise Exception("Product does not exist.")

        product.delete()
        return DeleteProduct(ok=True)

class CreateProductImage(graphene.Mutation):
    '''Mutation to create a new product image'''
    class Arguments:
        input = ProductImageInput(required=True)
        
    product_image = graphene.Field(ProductImageType)
    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, input):
        '''Create a new product image with the provided input data'''
        try:
            product = Product.objects.get(pk=input.product_id)
        except Product.DoesNotExist:
            raise Exception("Product does not exist.")

        product_image = ProductImage(
            product=product,
            image=input.image
        )
        product_image.save()
        return CreateProductImage(product_image=product_image, ok=True)

class DeleteProductImageById(graphene.Mutation):
    '''Mutation to delete an existing product image'''
    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, id):
        '''Delete an existing product image by ID'''
        try:
            product_image = ProductImage.objects.get(pk=id)
        except ProductImage.DoesNotExist:
            raise Exception("Product image does not exist.")

        product_image.delete()
        return DeleteProductImageById(ok=True)

class AddProductImageToProduct(graphene.Mutation):
    '''Mutation to add a product image to a product'''
    class Arguments:
        input = ProductImageInput(required=True)

    product_image = graphene.Field(ProductImageType)
    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, input):
        '''Add a product image to a product'''
        try:
            product = Product.objects.get(pk=input.product_id)
        except Product.DoesNotExist:
            raise Exception("Product does not exist.")

        product_image = ProductImage(
            product=product,
            image=input.image
        )
        product_image.save()
        return AddProductImageToProduct(product_image=product_image, ok=True)
    
class AddToCart(graphene.Mutation):
    '''Mutation to add a product to a user's cart'''
    class Arguments:
        input = CartItemInput(required=True)

    cart_item = graphene.Field(CartItemType)
    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, input):
        '''Add a product to a user's cart'''
        user = info.context.user # Get the authenticated user
        if user.is_anonymous:
            raise Exception("Authentication required.")
        if user is None:
            raise Exception("User not found.")
        
        cart, created = Cart.objects.get_or_create(user=user)
        try:
            # cart_item = CartItem.objects.create(cart=cart, product__id=input.product_id)
            # cart_item.quantity += input.quantity
            # cart_item.save()
            product = Product.objects.get(pk=input.product_id)
        except Product.DoesNotExist:
            raise Exception("Product does not exist.")
        
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += input.quantity
        else:
            cart_item.quantity = input.quantity
        cart_item.save()
        
        return AddToCart(cart_item=cart_item, ok=True)

class UpdateCartItem(graphene.Mutation):
    '''Mutation to update the quantity of a cart item'''
    class Arguments:
        id = graphene.Int(required=True)
        quantity = graphene.Int(required=True)

    cart_item = graphene.Field(CartItemType)
    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, id, quantity):
        '''Update the quantity of a cart item'''
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Authentication required.")
        if user is None:
            raise Exception("User not found.")

        cart, created = Cart.objects.get_or_create(user=user)
        try:
            cart_item = CartItem.objects.get(pk=id, cart=cart)
        except CartItem.DoesNotExist:
            raise Exception("Cart item does not exist.")

        cart_item.quantity = quantity
        cart_item.save()
        return UpdateCartItem(cart_item=cart_item, ok=True)
 
class RemoveCartItem(graphene.Mutation):
    '''Mutation to remove a cart item'''
    class Arguments:
        id = graphene.Int(required=True)

    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, id):
        '''Remove a cart item'''
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Authentication required.")

        try:
            cart_item = CartItem.objects.get(pk=id, cart__user=user)
        except CartItem.DoesNotExist:
            raise Exception("Cart item does not exist.")

        cart_item.delete()
        return RemoveCartItem(ok=True)

class CreateOrder(graphene.Mutation):
    '''Mutation to create a new order'''
    class Arguments:
        status = graphene.String(required=True) # e.g., 'created', 'shipped', etc.
    order = graphene.Field(OrderType)
    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, status='created'):
        '''Create a new order with the provided input data'''
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Authentication required.")
        if user is None:
            raise Exception("User not found.")

        # fetch user cart
        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            raise Exception("Cart does not exist.")
        
        if not cart or not cart.cart_items.exists():
            raise Exception("Cart is empty.")
        
        with transaction.atomic():
            # Pre-check stock availability
            for item in cart.cart_items.all():
                if item.product.amount_in_stock < item.quantity:
                    raise Exception(f"Insufficient stock for product {item.product.name}.")
            
            order = Order(
                user=user,
                status=status,
                total=Decimal('0.00')
            )
            order.save()

            order_total = Decimal('0.00')
            for item in cart.cart_items.all():
                # Decrement stock
                item.product.amount_in_stock -= item.quantity
                item.product.save()
                
                # Create order item
                OrderItem.objects.create(
                    order=order,
                    product=item.product,
                    quantity=item.quantity,
                )
                order_total += item.product.price * item.quantity
            
            # Save computed total
            order.total = order_total
            order.save()

            # Clear user cart
            cart.cart_items.all().delete()
        
        return CreateOrder(order=order, ok=True)

class CreateRating(graphene.Mutation):
    '''Mutation to create a new rating'''
    class Arguments:
        input = RatingInput(required=True)

    rating = graphene.Field(RatingType)
    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, input):
        '''Create a new rating with the provided input data'''
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Authentication required.")

        # Ensure the user in the token matches the user being rated-from
        if user.id != input.rating_from_id:
            raise Exception("You can only rate as the authenticated user.")

        try:
            product = Product.objects.get(pk=input.product_id)
        except Product.DoesNotExist:
            raise Exception("Product does not exist.")

        # No need to fetch the user again; we already have request_user
        rating = Rating(
            product=product,
            rating_from=user,
            rating=input.stars,
            comment=input.comment,
        )
        rating.save()
        return CreateRating(rating=rating, ok=True)

class CreateComment(graphene.Mutation):
    '''Mutation to create a new comment'''
    class Arguments:
        input = CommentInput(required=True)

    comment = graphene.Field(CommentType)
    ok = graphene.Boolean()

    @staticmethod
    def mutate(root, info, input):
        '''Create a new comment with the provided input data'''
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Authentication required.")
        if user is None:
            raise Exception("User not found.")
        if user.id != input.comment_from_id:
            raise Exception("Not authorized to comment as another user.")
        try:
            product = Product.objects.get(pk=input.product_id)
        except Product.DoesNotExist:
            raise Exception("Product does not exist.")

        comment = Comment(
            product=product,
            comment_from=user,
            body=input.body,
        )
        comment.save()
        return CreateComment(comment=comment, ok=True)

class CreatePayment(graphene.Mutation):
    '''Mutation responsible for creating a Stripe PaymentIntent
    and saving the record in our Payment model'''
    class Arguments:
        input = PaymentInput(required=True)

    payment = graphene.Field(PaymentType)
    ok = graphene.Boolean()
    client_secret = graphene.String() # Return client secret for frontend use

    @staticmethod
    def mutate(root, info, input):
        '''Create a new payment with the provided input data'''
        user = info.context.user
        if user.is_anonymous:
            raise Exception("Authentication required.")
        if user is None:
            raise Exception("User not found.")
        if user.id != input.user_id:
            raise Exception("Not authorized to create payment for another user.")
        try:
            order = Order.objects.get(pk=input.order_id)
        except Order.DoesNotExist:
            raise Exception("Order does not exist.")

        # Create Stripe PaymentIntent here
        try:
            intent = stripe.PaymentIntent.create(
                amount=int(Decimal(input.amount) * Decimal(100)).quantize(Decimal('1')),  # amount in cents
                currency=input.currency,
                metadata={
                    'user_id': user.id,
                    'order_id': order.id,
                    'cart_id': cart.id,
                }
            )
        except Exception as e:
            raise Exception(f"Stripe PaymentIntent creation failed: {str(e)}")
        
        payment = Payment(
            user=user,
            order=order,
            stripe_payment_intent=intent["id"],
            amount=input.amount,
            currency=input.currency,
            status="processing"  # initial status,
        )
        payment.save()
        return CreatePayment(payment=payment, client_secret=intent["client_secret"], ok=True)

# ==========================
# GraphQL Queries and resolvers
# ==========================
class Query(graphene.ObjectType):
    '''GraphQl Query to fetch user'''
    user = graphene.Field(UserType, id=graphene.Int(required=True))
    all_categories = DjangoFilterConnectionField(CategoryType)
    all_sub_categories = DjangoFilterConnectionField(SubCategoryType)
    all_products = DjangoFilterConnectionField(ProductType)
    product_by_id = graphene.Field(
        ProductType,
        id=graphene.Int(required=True),
    )
    product_by_category = DjangoFilterConnectionField(
        ProductType,
        category_id=graphene.Int(required=True),
    )
    product_by_sub_category = DjangoFilterConnectionField(
        ProductType,
        sub_category_id=graphene.Int(required=True),
    )
    products = graphene.List(
        ProductType,
        filter=ProductFilterInput(required=False),
    )
    category = graphene.Field(
        CategoryType,
        id=graphene.Int(required=True),
    )
    sub_category = graphene.Field(
        SubCategoryType,
        id=graphene.Int(required=True),
    )

    # Search queries can be added here
    search_products = graphene.List(
        ProductType,
        name=graphene.String(required=True),
    )
    product_by_price_range = graphene.List(
        ProductType,
        price__gte=graphene.Decimal(required=True),
        price__lte=graphene.Decimal(required=True),
    )
    search_categories = graphene.List(
        CategoryType,
        name=graphene.String(required=True),
    )
    search_sub_categories = graphene.List(
        SubCategoryType,
        name=graphene.String(required=True),
    )

    cart = graphene.Field(CartType)
    cart_items = DjangoFilterConnectionField(CartItemType)
    all_cart_items = DjangoFilterConnectionField(CartItemType)

    orders = DjangoFilterConnectionField(OrderType)
    order_items = DjangoFilterConnectionField(OrderItemType)

    all_ratings = DjangoFilterConnectionField(RatingType)
    all_comments = DjangoFilterConnectionField(CommentType)
    all_payments = DjangoFilterConnectionField(PaymentType)

    def resolve_products(self, info, filter=None):
        """
        Resolver to fetch products with optional filtering.
        Supports:
          - name (icontains)
          - category (exact)
          - subcategory (exact)
          - price__gte / price__lte
          - stock__gte / stock__lte
          - low_stock (True → amount_in_stock < 10)
        """
        qs = Product.objects.all()

        if not filter:
            return qs

        # name
        if filter.get("name"):
            qs = qs.filter(name__icontains=filter["name"])

        # category
        if filter.get("category"):
            qs = qs.filter(category_id=filter["category"])

        # subcategory
        if filter.get("subcategory"):
            qs = qs.filter(sub_category_id=filter["subcategory"])

        # price range
        if filter.get("price__gte") is not None:
            qs = qs.filter(price__gte=filter["price__gte"])
        if filter.get("price__lte") is not None:
            qs = qs.filter(price__lte=filter["price__lte"])

        # stock range
        if filter.get("stock__gte") is not None:
            qs = qs.filter(amount_in_stock__gte=filter["stock__gte"])
        if filter.get("stock__lte") is not None:
            qs = qs.filter(amount_in_stock__lte=filter["stock__lte"])

        # low_stock flag
        if filter.get("low_stock"):
            qs = qs.filter(amount_in_stock__lt=10)

        return qs

    def resolve_product_by_id(self, info, id):
        '''Resolver to fetch a product by ID'''
        try:
            return Product.objects.filter(pk=id)
        except Product.DoesNotExist:
            return None
        
    def resolve_all_products(self, info, **kwargs):
        '''Resolver to fetch all products with optional filtering'''
        return Product.objects.all()
    
    def resolve_user(self, info, id):
        '''Resolver to felch a user by ID'''
        user = info.context.user

        if user.is_anonymous:
            raise Exception("Authentication required.")
        if user.id != id:
            raise Exception("Not authorized to view this user.")
        try:
            return User.objects.get(pk=id)
        except User.DoesNotExist:
            return None
    
    def resolve_products(self, info, filters=None):
        '''Resolver to fetch products with optional filtering'''
        #return Product.objects.get(id=id)
        if filters:
            return Product.objects.filter(**filters)
        return Product.objects.all()

class Mutation(graphene.ObjectType):
    '''Root Schema for mutations'''
    create_user = CreateUser.Field()
    login_user = LoginUser.Field()
    create_category = CreateCategory.Field()
    update_category = UpdateCategory.Field()
    delete_category = DeleteCategory.Field()

    create_sub_category = CreateSubCategory.Field()
    update_sub_category = UpdateSubCategory.Field()
    delete_sub_category = DeleteSubCategory.Field()

    create_product = CreateProduct.Field()
    update_product = UpdateProduct.Field()
    delete_product = DeleteProduct.Field()

    create_product_image = CreateProductImage.Field()
    delete_product_image = DeleteProductImageById.Field()
    add_product_image_to_product = AddProductImageToProduct.Field()

    add_to_cart = AddToCart.Field()
    update_cart_item = UpdateCartItem.Field()
    remove_cart_item = RemoveCartItem.Field()

    create_rating = CreateRating.Field()
    create_comment = CreateComment.Field()
    create_payment = CreatePayment.Field()

    create_order = CreateOrder.Field()

schema = graphene.Schema(
    query=Query,
    mutation=Mutation
)
