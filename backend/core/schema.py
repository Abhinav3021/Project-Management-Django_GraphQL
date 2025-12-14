import graphene
import projects.schema

class Query(projects.schema.Query, graphene.ObjectType):
    pass

class Mutation(projects.schema.Mutation, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)