import httpx
from fastapi import Depends, HTTPException, Request
from clerk_backend_api import AuthenticateRequestOptions
from app.core.config import settings 
from app.core.clerk import clerk


# frontend( jwt tokens from clerk ) -> backend
# backend authenciate this token 
# get the user details from clerk
# check the permissions