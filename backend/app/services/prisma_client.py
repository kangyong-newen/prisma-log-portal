import requests

from app.config import (
    TSG_ID,
    LS_TENANT,
    REGION
)

class PrismaClient:

    def __init__(self, token):

        self.token = token

        self.base_url = (
            f"https://pa-{REGION}"
            ".api.prismaaccess.com"
        )

    def query(
        self,
        endpoint,
        payload
    ):

        url = (
            f"{self.base_url}"
            f"/api/sase/v3.0/resource/query/logviewer/{endpoint}"
        )

        headers = {

            "Authorization":
                f"Bearer {self.token}",

            "Content-Type":
                "application/json",

            "Accept":
                "application/json",

            "prisma-tenant":
                f"{TSG_ID}:{LS_TENANT}",

            "prisma-client-pageid":
                "/logviewer",

            "prisma-client-widgetid":
                "log_viewer"
        }

        r = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=60
        )

        r.raise_for_status()

        return r.json()
