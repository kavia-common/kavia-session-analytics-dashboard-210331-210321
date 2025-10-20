#!/bin/bash
cd /home/kavia/workspace/code-generation/kavia-session-analytics-dashboard-210331-210321/session_dashboard_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

