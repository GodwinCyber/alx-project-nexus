import graphene
from graphene import relay


class CustomNode(graphene.Node):
    class Meta:
        name = "CustomNode"

    @staticmethod
    def to_global_id(type, id):
        return str(id)

    @staticmethod
    def from_global_id(to_global_id):
        return "", to_global_id
