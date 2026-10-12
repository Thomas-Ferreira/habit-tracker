#!/usr/bin/env bash
cd "$(dirname "$0")"

# Ctrl+C ou fermeture du terminal : on tue tout le groupe de processus
trap 'kill 0' EXIT INT TERM

npm --prefix backend run dev  2>&1 | sed -u 's/^/[back]  /' &
npm --prefix frontend run dev 2>&1 | sed -u 's/^/[front] /' &

wait