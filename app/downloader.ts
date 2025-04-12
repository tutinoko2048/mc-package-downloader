const releaseRegex = /^\d+\.\d+\.\d+$/;

const typeList: Record<'full' | 'preview' | 'release' | 'rc', Record<string, (version: string) => void>> = {
  full: {
    'stable-beta': (version: string) => version.includes('beta') && (version.includes('stable') || version.includes('release')),
    'release': (version: string) => releaseRegex.test(version),
    'preview-beta': (version: string) => version.includes('preview') && version.includes('beta'),
    'preview-rc': (version: string) => version.includes('preview') && version.includes('rc')
  },
  preview: {
    'stable': (version: string) => !version.includes('preview'),
    'preview': (version: string) => version.includes('preview')
  },
  release: {
    'release': (_version: string) => true
  },
  rc: {
    'release': (version: string) => releaseRegex.test(version),
    'preview-rc': (version: string) => version.includes('preview') && version.includes('rc')
  }
}

export const packages = {
  'server': { typeList: typeList.full },
  'server-ui': { typeList: typeList.full },
  'vanilla-data': { typeList: typeList.preview },
  'math': { typeList: typeList.release },
  'server-net': { typeList: typeList.full },
  'debug-utilities': { typeList: typeList.full},
  'server-gametest': { typeList: typeList.full },
  'server-editor': { typeList: typeList.full },
  'server-admin': { typeList: typeList.full },
  'common': { typeList: typeList.rc },
  'diagnostics': { typeList: typeList.full },
}

export type Packages = keyof typeof packages;

export async function getPackageVersions(packageName: Packages, type: string): Promise<NPM.VersionData[]> {
  const res = await fetch(`https://registry.npmjs.org/@minecraft/${packageName}`);
  const data: NPM.Package = await res.json();
  const filter = packages[packageName].typeList[type];
  const versions = Object.values(data.versions)
    .filter(x => !x.version.includes('internal'))
    .filter(x => filter(x.version))
    .reverse();
  for (const v of versions) {
    v.updated_at = data.time[v.version];
  }
  return versions;
}

export namespace NPM {
  export interface Package {
    versions: Record<string, VersionData>;
    time: Record<string, string>;
  }

  export interface VersionData {
    name: string;
    version: string;
    dist: {
      tarball: string;
    },
    updated_at: string;
  }
}
