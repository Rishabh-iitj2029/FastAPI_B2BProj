import httpx
from fastapi import Depends, HTTPException, Request,status
from clerk_backend_api import AuthenticateRequestOptions
from app.core.config import settings 
from app.core.clerk import clerk


# frontend( jwt tokens from clerk ) -> backend
# backend authenciate this token 
# get the user details from clerk
# check the permissions


class AuthUser:
    def __init__(self, user_id:str, org_id:str,org_permissions:list):
        self.user_id = user_id
        self.org_id = org_id
        self.org_permisions = org_permissions
        

    def has_permission(self,permissions:str) -> bool:
        return permissions in self.org_permisions

    @property
    def can_view(self) -> bool:
        return self.has_permission("org:tasks:view")
    
    @property
    def can_edit(self) -> bool:
        return self.has_permission("org:tasks:edit")
    
    @property
    def can_create(self) -> bool:
        return self.has_permission("org:tasks:create")
    
    @property
    def can_delete(self) -> bool:
        return self.has_permission("org:tasks:delete")
    

def convert_to_httpx_request(fastapi_request:Request) -> httpx.Request:
    return httpx.Request(
        method=fastapi_request.method,
        url=str(fastapi_request.url),
        headers=dict(fastapi_request.headers)

    )

async def get_current_user(request:Request) -> AuthUser:
    httpx_request = convert_to_httpx_request(request)

    request_state = clerk.authenticate_request(
        httpx_request,
        AuthenticateRequestOptions(authorized_parties=[settings.FRONTEND_URL])
    )


    if not request_state.is_signed_in:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenciated"
        )
    
    claims = request_state.payload
    user_id = claims.get("key")
    org_id = claims.get("org_id")
    org_permission =claims.get("permissions") or claims.get("org_permissions") or []

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenciated"
        )
    
    if not org_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No organizated selected"
        )


    return AuthUser(user_id=user_id, org_id=org_id, org_permissions=org_permission)

def require_view(user: AuthUser = Depends(get_current_user)) -> AuthUser:
    if not user.can_view:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="View permission required"
        )
    return user

def require_create(user: AuthUser = Depends(get_current_user)) -> AuthUser:
    if not user.can_create:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="create permission required"
        )
    return user

def require_edit(user: AuthUser = Depends(get_current_user)) -> AuthUser:
    if not user.can_view:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Edit permission required"
        )
    return user

def require_delete(user: AuthUser = Depends(get_current_user)) -> AuthUser:
    if not user.can_view:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="delete permission required"
        )
    return user

