const releaseRegex = /^\d+\.\d+\.\d+$/;

const typeList = {
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
  stable: {
    'stable': (_version: string) => true
  }
}

export const packages: Record<Packages, { typeList: Record<string, (version: string) => boolean> }> = {
  'server': { typeList: typeList.full },
  'server-ui': { typeList: typeList.full },
  'vanilla-data': { typeList: typeList.preview },
  'math': { typeList: typeList.stable },
  'server-net': { typeList: typeList.full }
}

export type Packages = 'server' | 'server-ui' | 'vanilla-data' | 'math' | 'server-net';

export async function getPackageVersions(packageName: Packages, type: string): Promise<NPM.VersionData[]> {
  console.log(packageName, type)
  const res = await fetch(`https://registry.npmjs.org/@minecraft/${packageName}`);
  const data: NPM.Package = await res.json();
  const filter = packages[packageName].typeList[type];
  const versions = Object.values(data.versions)
    .filter(x => !x.version.includes('internal'))
    .filter(x => filter(x.version))
    .reverse();
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
    }
  }
}
