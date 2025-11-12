import graphene


class Query(graphene.ObjectType):
    '''Root GraphQL query type'''
    hello = graphene.String(default_value="Hello, GraphQL!")

schema = graphene.Schema(query=Query)