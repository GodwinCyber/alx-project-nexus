import graphene
from ecommerce.schema import Query as ECOMMERCEQuery, Mutation as ECOMMERCEMutation


class Query(graphene.ObjectType):
    '''Root GraphQL query type'''
    hello = graphene.String(default_value="Hello, GraphQL!")

class Query(ECOMMERCEQuery, graphene.ObjectType):
    '''Combined Query class'''
    pass

class Mutation(ECOMMERCEMutation, graphene.ObjectType):
    '''Combined Mutation class'''
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)