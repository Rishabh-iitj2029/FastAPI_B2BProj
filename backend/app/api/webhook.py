import json

from fastapi import APIRouter, Request, HTTPException, status

from svix.webhooks import Webhook, WebhookVerificationError
from app.core.config import settings
from app.core.clerk import clerk

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])

PRO_TIER_SLUG = "pro-tier"
FREE_TIER_LIMIT = settings.FREE_TIER_MEMBERSHIP_LIMIT
UNLIMIT_LIMIT = 100000000000

def set_org_member_limit(org_id: str, limit: int):
    clerk.organizations.update(
        organization_id=org_id,
        max_allowed_memberships=limit
    )

def has_active_pro_plan(items: list) -> bool:
    return any(
        item.get("plan", {}).get("slug") == PRO_TIER_SLUG
        and item.get("status") == "active"
        for item in items
    )

def extract_org_id(data: dict) -> str | None:
    if data.get("organization_id"):
        return data["organization_id"]

    payer_id = data.get("payer_id", "")
    if isinstance(payer_id, str) and payer_id.startswith("org_"):
        return payer_id

    payer = data.get("payer") or {}
    if payer.get("organization_id"):
        return payer["organization_id"]

    return None

@router.post("/clerk")
async def clerk_webhook(request: Request):
    payload = await request.body()
    headers = dict(request.headers)

    if settings.CLERK_WEBHOOK_SECRET:
        try:
            wh = Webhook(settings.CLERK_WEBHOOK_SECRET)
            event = wh.verify(payload, headers)

        except WebhookVerificationError:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid signature")

    else:
        event = json.loads(payload)

    event_type = event.get("type", "")
    data = event.get("data", {})

    if event_type in ["subscription.created", "subscription.updated"]:
        org_id = extract_org_id(data)
        if org_id:
            items = data.get("subscription_items", [])
            limit = UNLIMIT_LIMIT if has_active_pro_plan(items) else FREE_TIER_LIMIT
            set_org_member_limit(org_id, limit)


    elif event_type in ["subscriptionItem.canceled", "subscriptionItem.ended"]:
        org_id = extract_org_id(data)
        if org_id:
            set_org_member_limit(org_id, FREE_TIER_LIMIT)

    return {"received": True}