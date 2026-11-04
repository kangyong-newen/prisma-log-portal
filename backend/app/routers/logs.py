from fastapi import APIRouter, Query
from datetime import datetime, timedelta, timezone

from app.services.prisma_auth import PrismaAuth
from app.services.prisma_client import PrismaClient
from app.utils.flatten import flatten_log

router = APIRouter()


@router.get("/traffic")
def get_traffic(
    source_ip: str | None = Query(default=None),
    dest_ip: str | None = Query(default=None),
    user: str | None = Query(default=None),
    action: str | None = Query(default=None),
    rule: str | None = Query(default=None),
    reason: str | None = Query(default=None),
    dest_port: str | None = Query(default=None),
    app: str | None = Query(default=None),
    limit: int = Query(default=50),
    time_range: str = Query(default="60m"),
):
    token = PrismaAuth().get_token()["access_token"]

    prisma = PrismaClient(token)

    now = datetime.now(timezone.utc)

    if time_range == "5m":
        start = now - timedelta(minutes=5)
    elif time_range == "60m":
        start = now - timedelta(hours=1)
    elif time_range == "24h":
        start = now - timedelta(hours=24)
    elif time_range == "7d":
        start = now - timedelta(days=7)
    else:
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

    if user:
        rules.append(
            {
                "property": "users",
                "operator": "contains",
                "values": [user],
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

    if dest_port:
        rules.append(
            {
                "property": "dest_port",
                "operator": "equals",
                "values": [int(dest_port)],
            }
        )

    if rule:
        rules.append(
            {
                "property": "rule_matched",
                "operator": "contains",
                "values": [rule],
            }
        )

    if reason:
        rules.append(
            {
                "property": "session_end_reason",
                "operator": "contains",
                "values": [reason],
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
            "page_size": limit,
        },
    }

    result = prisma.query(
        endpoint="firewall_traffic",
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
