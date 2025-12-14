from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView

urlpatterns = [
    path('admin/', admin.site.urls),
    # We use csrf_exempt so we can test easily without CSRF tokens for now
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True))),
]