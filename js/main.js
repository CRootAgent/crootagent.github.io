// CRootAgent Landing Page Main Script
// Conforms to CrootJS conventions: ES module imported via CDN

import { getJSON } from 'https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.28/api.min.js';
import { onClick, setInner, setInnerText } from 'https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.28/element.min.js';
import { isMobile } from 'https://cdn.jsdelivr.net/gh/crootjs/lib@0.0.28/useragent.min.js';

const GITHUB_REPO = 'CRootAgent/crootagent';
const API_URL = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;
const RELEASES_PAGE = `https://github.com/${GITHUB_REPO}/releases/latest`;

// Helper: Format byte sizes
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Detect client OS and architecture
function detectUserOS() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform ? window.navigator.platform.toLowerCase() : '';

  if (isMobile()) {
    return { os: 'Mobile', arch: 'unknown', assetName: null, label: 'Kunjungi di Komputer (CLI Tool)' };
  }

  if (userAgent.includes('win') || platform.includes('win')) {
    return {
      os: 'Windows',
      arch: 'x86_64',
      assetName: 'crootagent-windows-x86_64.zip',
      label: 'Unduh untuk Windows (x86_64 .zip)'
    };
  }

  if (userAgent.includes('mac') || platform.includes('mac')) {
    // Check if Apple Silicon (arm64) or Intel
    const isArm = userAgent.includes('arm') || userAgent.includes('apple') || (navigator.userAgentData && navigator.userAgentData.architecture === 'arm');
    if (isArm) {
      return {
        os: 'macOS (Apple Silicon)',
        arch: 'arm64',
        assetName: 'crootagent-macos-arm64.tar.gz',
        label: 'Unduh untuk macOS (Apple Silicon arm64)'
      };
    } else {
      return {
        os: 'macOS (Intel)',
        arch: 'x86_64',
        assetName: 'crootagent-macos-x86_64.tar.gz',
        label: 'Unduh untuk macOS (Intel x86_64)'
      };
    }
  }

  if (userAgent.includes('linux') || platform.includes('linux')) {
    return {
      os: 'Linux',
      arch: 'x86_64',
      assetName: 'crootagent-linux-x86_64.tar.gz',
      label: 'Unduh untuk Linux (x86_64 .tar.gz)'
    };
  }

  return {
    os: 'Sistem Operasi Lainnya',
    arch: 'x86_64',
    assetName: 'crootagent-linux-x86_64.tar.gz',
    label: 'Unduh Binary Rilis Terbaru'
  };
}

// Fetch and render GitHub Releases using CrootJS api.js getJSON
async function loadLatestRelease() {
  const userOS = detectUserOS();
  const osBadge = document.getElementById('detected-os-badge');
  if (osBadge) {
    osBadge.textContent = `Sistem terdeteksi: ${userOS.os} ${userOS.arch !== 'unknown' ? `(${userOS.arch})` : ''}`;
  }

  try {
    const { status, data } = await getJSON(API_URL);

    if (status === 200 && data && data.assets && data.assets.length > 0) {
      renderReleaseData(data, userOS);
    } else {
      renderFallbackRelease(userOS, data ? data.message : 'Belum ada rilis resmi terpublikasi');
    }
  } catch (err) {
    console.warn('Gagal memanggil GitHub Releases API:', err);
    renderFallbackRelease(userOS, 'Koneksi API dibatasi atau belum tersedia rilis.');
  }
}

// Render dynamic release data
function renderReleaseData(release, userOS) {
  const tagEl = document.getElementById('release-tag');
  const dateEl = document.getElementById('release-date');
  const btnDownload = document.getElementById('btn-download-os');
  const labelDownload = document.getElementById('label-download');
  const tableBody = document.getElementById('assets-table-body');

  if (tagEl) tagEl.textContent = release.tag_name || 'v0.1.0';
  if (dateEl) {
    const pubDate = new Date(release.published_at || release.created_at);
    dateEl.textContent = pubDate.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Find matching asset for user OS
  let matchedAsset = null;
  if (userOS.assetName) {
    matchedAsset = release.assets.find(a => a.name.toLowerCase() === userOS.assetName.toLowerCase());
  }
  if (!matchedAsset && release.assets.length > 0) {
    matchedAsset = release.assets[0];
  }

  if (matchedAsset && btnDownload && labelDownload) {
    btnDownload.href = matchedAsset.browser_download_url;
    labelDownload.textContent = `${userOS.label} (${formatBytes(matchedAsset.size)})`;
  }

  // Render assets table
  if (tableBody) {
    let rowsHtml = '';
    release.assets.forEach(asset => {
      let targetName = 'Arsip Rilis';
      if (asset.name.includes('linux')) targetName = '🐧 Linux (x86_64)';
      else if (asset.name.includes('macos-arm64')) targetName = '🍎 macOS Apple Silicon (arm64)';
      else if (asset.name.includes('macos-x86_64')) targetName = '🍎 macOS Intel (x86_64)';
      else if (asset.name.includes('windows')) targetName = '🪟 Windows (x86_64)';
      else if (asset.name.endsWith('.sha256')) targetName = '🔑 Checksum SHA256';

      rowsHtml += `
        <tr>
          <td><strong>${targetName}</strong></td>
          <td><code>${asset.name}</code></td>
          <td>${formatBytes(asset.size)}</td>
          <td>
            <a href="${asset.browser_download_url}" class="btn btn-sm btn-outline" download>Unduh ⬇</a>
          </td>
        </tr>
      `;
    });
    tableBody.innerHTML = rowsHtml;
  }
}

// Fallback if no releases API yet
function renderFallbackRelease(userOS, message) {
  const tagEl = document.getElementById('release-tag');
  const dateEl = document.getElementById('release-date');
  const tableBody = document.getElementById('assets-table-body');
  const btnDownload = document.getElementById('btn-download-os');
  const labelDownload = document.getElementById('label-download');

  if (tagEl) tagEl.textContent = 'v0.1.0 (Development)';
  if (dateEl) dateEl.textContent = '17 November 2026';

  if (btnDownload && labelDownload) {
    btnDownload.href = RELEASES_PAGE;
    labelDownload.textContent = `${userOS.label}`;
  }

  if (tableBody) {
    const standardBinaries = [
      { os: '🐧 Linux (x86_64)', file: 'crootagent-linux-x86_64.tar.gz', size: '~6.8 MB' },
      { os: '🍎 macOS Apple Silicon (arm64)', file: 'crootagent-macos-arm64.tar.gz', size: '~6.2 MB' },
      { os: '🍎 macOS Intel (x86_64)', file: 'crootagent-macos-x86_64.tar.gz', size: '~6.5 MB' },
      { os: '🪟 Windows (x86_64)', file: 'crootagent-windows-x86_64.zip', size: '~7.1 MB' }
    ];

    let rowsHtml = '';
    standardBinaries.forEach(b => {
      rowsHtml += `
        <tr>
          <td><strong>${b.os}</strong></td>
          <td><code>${b.file}</code></td>
          <td>${b.size}</td>
          <td>
            <a href="${RELEASES_PAGE}" class="btn btn-sm btn-outline">Lihat Rilis ↗</a>
          </td>
        </tr>
      `;
    });
    tableBody.innerHTML = rowsHtml;
  }
}

// Setup copy button
function setupCopyButton() {
  const copyBtn = document.getElementById('btn-copy-curl');
  if (copyBtn) {
    onClick('btn-copy-curl', () => {
      const cmd = 'curl -fsSL https://crootagent.github.io/install.sh | bash';
      navigator.clipboard.writeText(cmd).then(() => {
        copyBtn.textContent = 'Tersalin! ✔';
        setTimeout(() => {
          copyBtn.textContent = 'Salin';
        }, 2000);
      });
    });
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  setupCopyButton();
  loadLatestRelease();
});
