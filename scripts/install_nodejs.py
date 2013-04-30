#!/usr/bin/env python2.7

import os
import sys
import tempfile
import shutil
from subprocess import call, check_output, CalledProcessError
import tarfile
from gzip import GzipFile
import StringIO
import argparse

NODEJS_DIST = 'http://nodejs.org/dist'
PLATFORM = sys.platform

def download(url, filename, verbose=True):
    from urllib2 import urlopen, HTTPError, URLError

    try:
        connection = urlopen(url)
    except HTTPError as e:
        print 'Failed downloading %s: HTTPError %s' % (url, e.code)
        exit(1)
    except URLError as e:
        print 'Failed downloading %s: URLError %s' % (url, e)
        exit(1)

    if verbose:
        print 'Downloading: %s -> %s' % (url, filename)

    with open(filename, 'wb') as output:
        output.write(connection.read())

    return filename

#
#
def nodejs_get_version(allow_system_node):
    try:
        if allow_system_node:
            return str(check_output('node --version', shell=True)).rstrip()
        elif PLATFORM == 'win32':
            return str(check_output('env\\Scripts\\node --version', shell=True)).rstrip()
        else:
            return str(check_output('env/bin/node --version', shell=True)).rstrip()

    except CalledProcessError:
        return ''

#
#
def nodejs_install_binary_win32(version, filename):
    if filename is None:
        url = '%s/%s/node.exe' % (NODEJS_DIST, version)
        download(url, 'env/Scripts/node.exe')
    else:
        shutil.copyfile(filename, 'env/Scripts/node.exe')

    with tempfile.NamedTemporaryFile(suffix='.tar.gz') as f:
        tmpfile = f.name
        f.close()

        # download the source and extract the npm module
        basename = 'node-%s' % version
        srcurl = '%s/%s/%s.tar.gz' % (NODEJS_DIST, version, basename)
        download(srcurl, tmpfile)

        depsprefix = '%s/deps/' % basename
        npmprefix = '%snpm' % depsprefix
        moduledir = os.path.join('env', 'Scripts', 'node_modules/')
        with GzipFile(tmpfile, mode='rb') as gzipfile:
            tardata = gzipfile.read()
        with tarfile.open(fileobj=StringIO.StringIO(tardata), mode='r') as tarobj:
            entries = tarobj.getmembers()
            npmfiles = [ (e.name.replace(depsprefix, moduledir), e) for e in entries
                            if e.isfile() and e.name.startswith(npmprefix) ]
            for target, npmfile in npmfiles:
                tarentry = tarobj.extractfile(npmfile)
                if not os.path.exists(os.path.dirname(target)):
                    os.makedirs(os.path.dirname(target))
                with open(target, 'w') as output:
                    output.write(tarentry.read())
        shutil.copyfile('env/Scripts/node_modules/npm/bin/npm.cmd', 'env/Scripts/npm.cmd')


#
#
def nodejs_install_binary_unix(version, platform):

    basename = 'node-%s-%s-x86' % (version, platform)
    url = '%s/%s/%s.tar.gz' % (NODEJS_DIST, version, basename)

    with tempfile.NamedTemporaryFile(suffix='.tar.gz') as zipfile:
        filename = zipfile.name
        zipfile.close()

        download(url, filename)

        excludes = [ 'ChangeLog', 'LICENSE', 'README*' ]
        tar_cmd = 'tar -xzf %s --strip-components 1 -C env %s' \
            % (filename, ' '.join(['--exclude "%s"' % e for e in excludes]))

        print 'Executing: %s' % tar_cmd
        if 0 != call(tar_cmd, shell=True):
            raise Exception('failed to extract nodejs')

#
#
def nodejs_install_source_unix(version):

    destdir = os.path.abspath('./env')
    basename = 'node-%s' % version
    url = '%s/%s/%s.tar.gz' % (NODEJS_DIST, version, basename)

    tmpd = tempfile.mkdtemp()
    filename = os.path.join(tmpd, '%s.tar.gz' % basename)

    download(url, filename)

    def docall(cmd, cwd):
        print 'Executing: %s' % cmd
        return call(cmd, shell=True, cwd=cwd)

    srcdir = os.path.join(tmpd, basename)
    if 0 != docall('tar -xzf %s.tar.gz' % basename, tmpd) or \
            0 != docall('./configure --prefix=%s' % destdir, srcdir) or \
            0 != docall('make -j 5 -s > /dev/null', srcdir) or \
            0 != docall('make install', srcdir):
        print 'Error building nodejs from source.'
        exit(1)

    # Clean up the entire temporary directory

    shutil.rmtree(tmpd)


############################################################

def typescript_install_win32(version):
    if 0 != call('env\\Scripts\\npm.cmd install -g typescript', shell=True):
        raise Exception('failed to install typescript via npm')

def typescript_install_unix(_version):

    if 0 != call('env/bin/npm install -g typescript', shell=True):
        raise Exception('failed to install typescript via npm')

############################################################

#
#
#
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--version', default='v0.8.14')
    parser.add_argument('--typescript', action='store_true', help='Install TypeScript compiler package')
    parser.add_argument('--typescript-version', default='0.8.3')
    parser.add_argument('-f', '--force', action='store_true')
    parser.add_argument('--allow-system-node', action='store_true',
                        help='Allow use of an existing node install')
    parser.add_argument('downloaded_file', nargs='?', default=None)

    args = parser.parse_args(sys.argv[1:])

    filename = args.downloaded_file
    version = args.version

    # print 'Version: %s (current=%s), PLATFORM: %s' \
    #     % (version, current_version, PLATFORM)

    install_nodejs = True
    if not args.force:
        current_version = nodejs_get_version(args.allow_system_node)
        if version == current_version:
            print 'NodeJS version %s already installed.' % version
            install_nodejs = False

    if install_nodejs and version != '-':
        print 'Installing nodejs-%s' % version

        if 'darwin' == PLATFORM:
            # nodejs_install_source_unix(version)
            nodejs_install_binary_unix(version, PLATFORM)

        elif PLATFORM.startswith('linux'):
            nodejs_install_source_unix(version)
            # nodejs_install_binary_unix(version, 'linux')

        elif 'win32' == PLATFORM:
            nodejs_install_binary_win32(version, filename)
    else:
        print 'Skipping nodejs.'

    ts_version = args.typescript_version
    if (not args.typescript) or ('-' == ts_version):
        print 'Skipping typescript.'
    else:
        print 'Installing typescript-%s' % ts_version
        if 'win32' == PLATFORM:
            typescript_install_win32(ts_version)
        else:
            typescript_install_unix(ts_version)
    return 0


if '__main__' == __name__:
    exit(main())
