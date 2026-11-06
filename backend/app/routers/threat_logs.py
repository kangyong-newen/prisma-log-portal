from fastapi import APIRouter, Query
from datetime import datetime, timedelta, timezone

from app.services.prisma_auth import PrismaAuth
from app.services.prisma_client import PrismaClient
from app.utils.flatten import flatten_log

router = APIRouter()


@router.get("/threat")
def get_threat_logs(

    action: str | None = Query(default=None),
    severity: str | None = Query(default=None),

    threat_name: str | None = Query(default=None),

    rule: str | None = Query(default=None),

    source_ip: str | None = Query(default=None),
    dest_ip: str | None = Query(default=None),

    dest_port: str | None = Query(default=None),

    user: str | None = Query(default=None),

    app: str | None = Query(default=None),

    direction_of_attack: str | None = Query(default=None),

    file_name: str | None = Query(default=None),
    file_type: str | None = Query(default=None),

    verdict: str | None = Query(default=None),

    url_domain: str | None = Query(default=None),

    time_range: str = Query(default="60m"),

    limit: int = Query(default=50)

):

    token = PrismaAuth().get_token()["access_token"]

    prisma = PrismaClient(token)

    now = datetime.now(timezone.utc)

    if time_range == "5m":
        start = now - timedelta(minutes=5)

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
                int(now.timestamp() * 1_000_000)
            ]
        }
    ]

    if action:
        rules.append(
            {
                "property": "action.value",
                "operator": "equals",
                "values": [action]
            }
        )

    if severity:
        rules.append(
            {
                "property": "severity",
                "operator": "equals",
                "values": [severity]
            }
        )

    if threat_name:
        rules.append(
            {
                "property": "threat_name",
                "operator": "contains",
                "values": [threat_name]
            }
        )

    if rule:
        rules.append(
            {
                "property": "rule_matched",
                "operator": "contains",
                "values": [rule]
            }
        )

    if source_ip:
        rules.append(
            {
                "property": "source_ip.value",
                "operator": "ip_match_cidr",
                "values": [f"{source_ip}/32"]
            }
        )

    if dest_ip:
        rules.append(
            {
                "property": "dest_ip.value",
                "operator": "ip_match_cidr",
                "values": [f"{dest_ip}/32"]
            }
        )

    if dest_port:
        rules.append(
            {
                "property": "dest_port",
                "operator": "equals",
                "values": [str(dest_port)]
            }
        )

    if user:
        rules.append(
            {
                "property": "source_user",
                "operator": "contains",
                "values": [user]
            }
        )

    if app:
        rules.append(
            {
                "property": "app",
                "operator": "equals",
                "values": [app]
            }
        )

    if direction_of_attack:
        rules.append(
            {
                "property": "direction_of_attack.value",
                "operator": "contains",
                "values": [direction_of_attack]
            }
        )

    if file_name:
        rules.append(
            {
                "property": "file_name",
                "operator": "contains",
                "values": [file_name]
            }
        )

    if file_type:
        rules.append(
            {
                "property": "file_type",
                "operator": "contains",
                "values": [file_type]
            }
        )

    if verdict:
        rules.append(
            {
                "property": "verdict.value",
                "operator": "equals",
                "values": [verdict]
            }
        )

    if url_domain:
        rules.append(
            {
                "property": "url_domain",
                "operator": "contains",
                "values": [url_domain]
            }
        )

    payload = {
        "filter": {
            "rules": rules
        },
        "orderBy": {
            "properties": [
                {
                    "property": "time_generated",
                    "sort": {
                        "sequence": 1,
                        "order": "desc"
                    }
                }
            ]
        },
        "count": 50000,
        "pagination": {
            "page_number": 1,
            "page_size": limit
        }
    }

    result = prisma.query(
        endpoint="firewall_threat",
        payload=payload
    )

    logs = [
        flatten_log(row)
        for row in result.get("data", [])
    ]

    return {
        "count": len(logs),
        "logs": logs
    }
