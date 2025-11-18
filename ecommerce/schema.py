import graphene
from graphene_django import DjangoObjectType
from .models import User, Category, SubCategory, Product, ProductImage
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

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
        fields = ('id', 'name')

class SubCategoryType(DjangoObjectType):
    '''GraphQL type for the SubCategory model'''
    class Meta:
        model = SubCategory
        fields = ('id', 'name', 'category')

class ProductType(DjangoObjectType):
    '''GraphQL type for the Product model'''
    class Meta:
        model = Product
        fields = ('id', 'name', 'category', 'sub_category', 'description', 'price', 'amount_in_stock', 'created_at', 'updated_at')

class ProductImageType(DjangoObjectType):
    '''GraphQL type for the ProductImage model'''
    class Meta:
        model = ProductImage
        fields = ('id', 'product', 'image')

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
    category_id = graphene.Int(required=True)

class ProductInput(graphene.InputObjectType):
    '''Input type for creating or updating a product'''
    name = graphene.String(required=True)
    category_id = graphene.Int(required=True)
    sub_category_id = graphene.Int()
    description = graphene.String()
    price = graphene.Float(required=True)
    amount_in_stock = graphene.Int(required=True)

class ProductImageInput(graphene.InputObjectType):
    '''Input type for creating or updating a product image'''
    product_id = graphene.Int(required=True)
    image = graphene.String(required=True)  # Assuming image is provided as a base64 string or URL



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
        user = authenticate(email=email, password=password)
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
        category_id = input.category_id

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
            category = Category.objects.get(pk=input.category_id)
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
        category_id = input.category_id
        sub_category_id = input.sub_category_id
        description = input.description
        price = input.price
        amount_in_stock = input.amount_in_stock

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
            category = Category.objects.get(pk=input.category_id)
            product.category = category
        except Category.DoesNotExist:
            raise Exception("Category does not exist.")

        if input.sub_category_id:
            try:
                sub_category = SubCategory.objects.get(pk=input.sub_category_id)
                product.sub_category = sub_category
            except SubCategory.DoesNotExist:
                raise Exception("Sub-category does not exist.")
        else:
            product.sub_category = None

        product.description = input.description
        product.price = input.price
        product.amount_in_stock = input.amount_in_stock
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


class DeleteProductImage(graphene.Mutation):
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
        return DeleteProductImage(ok=True)

# ==========================
# GraphQL Queries and resolvers
# ==========================
class Query(graphene.ObjectType):
    '''GraphQl Query to fetch user'''
    user = graphene.Field(UserType, id=graphene.Int(required=True))

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
    delete_product_image = DeleteProductImage.Field()

schema = graphene.Schema(
    query=Query,
    mutation=Mutation
)