from fastapi import APIRouter, Query
from datetime import datetime, timedelta, timezone

from app.services.prisma_auth import PrismaAuth
from app.services.prisma_client import PrismaClient
from app.utils.flatten import flatten_log

router = APIRouter()


@router.get("/url")
def get_url_logs(
    action: str | None = Query(default=None),
    source_ip: str | None = Query(default=None),
    dest_ip: str | None = Query(default=None),
    user: str | None = Query(default=None),
    domain: str | None = Query(default=None),
    category: str | None = Query(default=None),
    app: str | None = Query(default=None),
):

    token = PrismaAuth().get_token()["access_token"]

    prisma = PrismaClient(token)

    now = datetime.now(timezone.utc)
    start = now - timedelta(hours=1)

    rules = [
        {
            "property": "event_time",
            "operator": "between",
            "values": [
                int(start.timestamp() * 1_000_000),
                int(now.timestamp() * 1_000_000),
            ],
        }
    ]

    if action:
        rules.append(
            {
                "property": "action.value",
                "operator": "equals",
                "values": [action],
            }
        )

    if source_ip:
        rules.append(
            {
                "property": "source_ip.value",
                "operator": "ip_match_cidr",
                "values": [f"{source_ip}/32"],
            }
        )

    if dest_ip:
        rules.append(
            {
                "property": "dest_ip.value",
                "operator": "ip_match_cidr",
                "values": [f"{dest_ip}/32"],
            }
        )

    if user:
        rules.append(
            {
                "property": "source_user",
                "operator": "contains",
                "values": [user],
            }
        )

    if domain:
        rules.append(
            {
                "property": "url_domain",
                "operator": "contains",
                "values": [domain],
            }
        )

    if category:
        rules.append(
            {
                "property": "url_category.value",
                "operator": "contains",
                "values": [category],
            }
        )

    if app:
        rules.append(
            {
                "property": "app",
                "operator": "equals",
                "values": [app],
            }
        )

    payload = {
        "filter": {
            "rules": rules,
        },
        "orderBy": {
            "properties": [
                {
                    "property": "time_generated",
                    "sort": {
                        "sequence": 1,
                        "order": "desc",
                    },
                }
            ]
        },
        "count": 50000,
        "pagination": {
            "page_number": 1,
            "page_size": 50,
        },
    }

    result = prisma.query(
        endpoint="firewall_url",
        payload=payload,
    )

    logs = [
        flatten_log(row)
        for row in result.get("data", [])
    ]

    return {
        "count": len(logs),
        "logs": logs,
    }
