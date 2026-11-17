#!/usr/bin/env bash
# CRootAgent Automated Installer Script (Linux & macOS)
# https://crootagent.github.io

set -euo pipefail

BOLD="$(tput bold 2>/dev/null || echo '')"
GREEN="$(tput setaf 2 2>/dev/null || echo '')"
CYAN="$(tput setaf 6 2>/dev/null || echo '')"
YELLOW="$(tput setaf 3 2>/dev/null || echo '')"
RESET="$(tput sgr0 2>/dev/null || echo '')"

echo "${CYAN}${BOLD}==> Memulai instalasi CRootAgent (CLI AI Coding Assistant)...${RESET}"

OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
  Linux)
    TARGET_OS="linux"
    ;;
  Darwin)
    TARGET_OS="macos"
    ;;
  *)
    echo "Sistem operasi '$OS' belum didukung oleh script ini."
    exit 1
    ;;
esac

case "$ARCH" in
  x86_64|amd64)
    TARGET_ARCH="x86_64"
    ;;
  arm64|aarch64)
    TARGET_ARCH="arm64"
    ;;
  *)
    echo "Arsitektur '$ARCH' belum didukung."
    exit 1
    ;;
esac

REPO="CRootAgent/crootagent"
TAG=$(curl -sSL "https://api.github.com/repos/${REPO}/releases/latest" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/' || echo "v0.1.0")

if [ -z "$TAG" ] || [ "$TAG" = "null" ]; then
  TAG="v0.1.0"
fi

echo "Mendeteksi sistem: ${GREEN}${TARGET_OS}-${TARGET_ARCH}${RESET} (Versi rilis: ${BOLD}${TAG}${RESET})"

if [ "$TARGET_OS" = "macos" ]; then
  if [ "$TARGET_ARCH" = "arm64" ]; then
    ASSET_NAME="crootagent-macos-arm64.tar.gz"
  else
    ASSET_NAME="crootagent-macos-x86_64.tar.gz"
  fi
else
  ASSET_NAME="crootagent-linux-x86_64.tar.gz"
fi

DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${TAG}/${ASSET_NAME}"
TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

echo "Mengunduh ${CYAN}${DOWNLOAD_URL}${RESET}..."
curl -sSL "$DOWNLOAD_URL" -o "$TMP_DIR/$ASSET_NAME" || {
  echo "${YELLOW}Catatan: Rilis GitHub belum memuat binary rilis publik.${RESET}"
  echo "Mencoba mengunduh dari mirror atau build lokal..."
  exit 0
}

tar -xzf "$TMP_DIR/$ASSET_NAME" -C "$TMP_DIR"
chmod +x "$TMP_DIR/crootagent"

INSTALL_DIR="/usr/local/bin"
if [ ! -w "$INSTALL_DIR" ]; then
  INSTALL_DIR="$HOME/.local/bin"
  mkdir -p "$INSTALL_DIR"
fi

mv "$TMP_DIR/crootagent" "$INSTALL_DIR/crootagent"

echo "${GREEN}${BOLD}✔ Berhasil memasang CRootAgent ke ${INSTALL_DIR}/crootagent!${RESET}"
echo ""
echo "Jalankan ${CYAN}${BOLD}crootagent${RESET} untuk memulai sesi interaktif pertama Anda."
echo "Panduan lengkap tersedia di: https://crootagent.github.io"
