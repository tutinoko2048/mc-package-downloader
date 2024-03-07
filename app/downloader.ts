
// 1.4.0-beta.1.20.10-stable 1.0.0-beta.release.1.19.40
const stableBetaRegex = /\d+\.\d+\.\d+-beta\.(?:\d+\.\d+\.\d+-stable|release\.\d+\.\d+\.\d+)/
// 1.6.0-beta.1.20.30-preview.20 1.0.0-beta.preview.1.19.50.20
const previewBetaRegex = /\d+\.\d+\.\d+-beta\.(?:\d+\.\d+\.\d+-preview\.\d+|preview\.\d+\.\d+\.\d+\.\d+)/
const previewRcRegex = /\d+\.\d+\.\d+-rc\.\d+\.\d+\.\d+-preview\.\d+/
const releaseRegex = /^\d+\.\d+\.\d+$/

export type Packages = 'server' | 'server-ui' | 'vanilla-data' | 'math' | 'server-net';

function sortVersion(a: string, b: string) {
  if (
    a.match(/release|rc|\.preview\./) || b.match(/release|rc|\.preview\./)
  ) {
    const va = a.match(/\d+\.\d+\.\d+/g)![1];
    const vb = b.match(/\d+\.\d+\.\d+/g)![1];
    const vaPreview = a.match(/\d{2}$/g);
    const vbPreview = b.match(/\d{2}$/g);
    if (!va || !vb) return a.localeCompare(b);
    const versionA = va + (vaPreview ? `.${vaPreview[0]}` : '');
    const versionB = vb + (vbPreview ? `.${vbPreview[0]}` : '');
    return versionA.localeCompare(versionB);
  }
  return a.localeCompare(b);
}

export async function getPackageVersions(packageName: Packages) {
  const res = await fetch(`https://registry.npmjs.org/@minecraft/${packageName}`)
  const data = await res.json();
  const versions = Object.keys(data.versions)
    .filter(x => !x.includes('internal'))
    .sort(sortVersion)
    .reverse();
  return versions;
}