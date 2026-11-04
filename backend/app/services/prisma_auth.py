import requests

from app.config import (
    CLIENT_ID,
    CLIENT_SECRET,
    TSG_ID
)

TOKEN_URL = (
    "https://auth.apps.paloaltonetworks.com"
    "/oauth2/access_token"
)


class PrismaAuth:

    def get_token(self):

        response = requests.post(
            TOKEN_URL,
            auth=(
                CLIENT_ID,
                CLIENT_SECRET
            ),
            data={
                "grant_type":
                    "client_credentials",

                "scope":
                    f"tsg_id:{TSG_ID}"
            },
            timeout=30
        )

        response.raise_for_status()

        return response.json()
