import graphene
from graphene_django import DjangoObjectType
from .models import User
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

# ==========================
# GraphQl inputs
# ==========================
class UserInput(graphene.InputObjectType):
    '''Input type for creating or updating a user'''
    email = graphene.String(required=True)
    username = graphene.String(required=True)
    password = graphene.String(required=True)

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
        
        # if not user.check_password(password):
        #     raise Exception("Invalid email or password.") # Verify the passwor

        # Generate tokens (implementation depends on your token generation logic)
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        return LoginUser(
            access_token=str(access),
            refresh_token=str(refresh),
            user=user,
            ok=True
        )

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

schema = graphene.Schema(
    query=Query,
    mutation=Mutation
)