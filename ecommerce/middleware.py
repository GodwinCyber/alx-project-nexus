# Custom middleware to extract JWT from headers for GraphQL requests
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.authentication import JWTAuthentication


class JWTGrapQLMiddleware:
    '''Attach user to info.context in GraphQL from JWT Bearer token.'''

    def resolve(self, next, root, info, **kwargs):
        request = info.context

        auth = JWTGrapQLMiddleware()
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if auth_header.startswith("Bearer "):
            raw_token = auth_header.split(" ")[1]
            auth = JWTAuthentication()
            try:
                validated_token = auth.get_validated_token(raw_token)
                user = auth.get_user(validated_token)
                request.user = user
            except Exception:
                request.user = AnonymousUser()
        else:
                request.user = AnonymousUser()
        return next(root, info, **kwargs)




