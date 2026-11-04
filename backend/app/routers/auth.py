from fastapi import APIRouter

from app.services.prisma_auth import PrismaAuth

router = APIRouter()

@router.get("/token")
def get_token():

    result = PrismaAuth().get_token()

    return {
        "token_type": result.get("token_type"),
        "expires_in": result.get("expires_in"),
        "token_length": len(
            result.get("access_token", "")
        )
    }
