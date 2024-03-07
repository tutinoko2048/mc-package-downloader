'use client';

import React from 'react';
import { Select, SelectItem, Spacer, Spinner } from '@nextui-org/react';
import { NPM, Packages, getPackageVersions, packages } from './downloader';
import { VersionTable } from './VersionTable';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const packageParam = searchParams.get('package') as Packages;
  const typeParam = searchParams.get('type') as string;

  const [packageName, setPackageName] = React.useState<Packages>(packageParam in packages ? packageParam : 'server');
  const typeList = packages[packageName].typeList;
  const [packageType, setPackageType] = React.useState<string>(typeParam in typeList ? typeParam : Object.keys(typeList)[0]);
  const [packageLoading, setPackageLoading] = React.useState<boolean>(false);
  const [packageVersions, setPackageVersions] = React.useState<NPM.VersionData[]>([]);

  const onChangePackage = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Packages || packageName;
    const type = packageType in packages[value].typeList ? packageType : Object.keys(packages[value].typeList)[0];
    setPackageName(value);
    if (e.target.value) setPackageType(type);
  }

  const onChangeType = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value || packageType;
    setPackageType(value);
  }

  const updateVersions = async (name: Packages, type: string) => {
    setPackageLoading(true);
    const versions = await getPackageVersions(name, type);
    setPackageVersions(versions);
    setPackageLoading(false);
  }

  React.useEffect(() => {
    updateVersions(packageName, packageType);
    const query = new URLSearchParams({ package: packageName, type: packageType });
    router.push(pathname + '?' + query.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageName, packageType]);

  return (
    <main>
      <Spacer y={3} />
      <h1 className='text-2xl'>Minecraft Package Downloader</h1>
      <Spacer y={3} />
      <div className='horizontal'>
        <Select required label='Package' size='sm' selectedKeys={[packageName]} onChange={onChangePackage}>
          {Object.keys(packages).map(mcpackage => <SelectItem key={mcpackage}>{`@minecraft/${mcpackage}`}</SelectItem>)}
        </Select>
        <Spacer x={1} y={1} />
        <Select required label='Type' size='sm' selectedKeys={[packageType]} onChange={onChangeType}>
          {Object.keys(packages[packageName].typeList).map(type => <SelectItem key={type}>{type}</SelectItem>)}
        </Select>
      </div>
      
      <Spacer y={4} />
      {packageLoading && <Spinner />}
      {!packageLoading && <VersionTable versions={packageVersions} />}
      <Spacer y={4} />

    </main>
  )
}
